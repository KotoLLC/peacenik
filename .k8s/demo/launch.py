import os
import sys
import subprocess
import yaml
import time
import pickle
import requests
import json
import psycopg2
import toml
from glob import glob
from termcolor import colored
from datetime import datetime, timezone

# some setup

dt = datetime.now(timezone.utc)
toml.load("settings.toml")

# These functions are for making requests to create users and such

def save_cookies(requests_cookiejar, filename):
    with open(filename, 'wb') as f:
        pickle.dump(requests_cookiejar, f)

def load_cookies(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)

def make_request(domain,service,raw_payload,cookies=0):
    payload = json.dumps(raw_payload)
    url = "https://" + domain + "/" + service
    headers = {'Content-Type': 'application/json'}
    if cookies == 1:
        response = requests.request("POST", url, headers=headers, data=payload, cookies=load_cookies("cookies.txt"))
    else:
        response = requests.request("POST", url, headers=headers, data=payload)
    save_cookies(response.cookies,"cookies.txt")
    time.sleep(1)

# This function is used by the yaml replacements

def replace_all(text, dic):
    for i, j in dic.iteritems():
        text = text.replace(i, j)
    return text

print(colored("\n\nDeploying k8s certificate manager",'green'))
subprocess.call('helm repo add jetstack https://charts.jetstack.io',shell=True,stdout=subprocess.PIPE)
subprocess.call('helm repo update',shell=True,stdout=subprocess.PIPE)
subprocess.call('helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.0  --set installCRDs=true ',shell=True,stdout=subprocess.PIPE)
subprocess.call('helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx',shell=True,stdout=subprocess.PIPE)
subprocess.call('helm upgrade --install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true',shell=True,stdout=subprocess.PIPE)

print(colored("Waiting for an IP address",'green'))
ip = ""
while ip == "":
  ip = subprocess.check_output('kubectl get svc nginx-ingress-ingress-nginx-controller --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}"', shell=True)
ready = input(colored("Now point A record + wildcard record for " + domain + " to " + ip + " and hit enter",'green'))

print(colored("Replacing values in deployment files",'green'))
d = { 
    "<MESSAGE-HUB-ADDRESS>" : "https://messages." + domain,
    "<MESSAGE-HUB-NO-PROTOCOL-ADDRESS>" : "messages." + domain,
    "<USER-HUB-ADDRESS>" : "https://users." + domain,
    "<USER-HUB-NO-PROTOCOL-ADDRESS>": "users." + domain,
    "<FRONTEND-ADDRESS>" : "https://" + domain,
    "<FRONTEND-NO-PROTOCOL-ADDRESS>" : domain,
    "<SMTP-HOST>" : smtp_host,
    "<SMTP-USER>" : smtp_user,
    "<SMTP-EMAIL>" :smtp_email,
    "<SMTP-PASSWORD>" : smtp_password,
    "<SMTP-PORT>" : smtp_port,
    "<SECRET>" : universal_secret,
    "<S3-ENDPOINT>" : s3_endpoint,
    "<S3-KEY>" : s3_key,
    "<S3-SECRET>" : s3_secret
}

result = [y for x in os.walk(".") for y in glob(os.path.join(x[0], '*.yaml'))]
for r in result:
    with open(r) as f:
        s = f.read()
    with open(r, 'w') as f:
        s = replace_all(s,d)
        f.write(s)

print(colored("Deploying Peacenik to k8s",'green'))
subprocess.call('kubectl apply -f namespaces/',shell=True,stdout=subprocess.PIPE)
sleep(1)
subprocess.call('kubectl create secret generic user-hub-key --from-literal=password="' + universal_secret + '" -n backend',shell=True,stdout=subprocess.PIPE)
sleep(1)
subprocess.call('kubectl apply -f backend/',shell=True,stdout=subprocess.PIPE)
sleep(1)
subprocess.call('kubectl apply -f frontend/',shell=True,stdout=subprocess.PIPE)
sleep(1)
subprocess.call('kubectl apply -f ingress/',shell=True,stdout=subprocess.PIPE)
sleep(1)
subprocess.call('kubectl apply -f cert-manager/',shell=True,stdout=subprocess.PIPE)
sleep(1)

print(colored("Waiting pods to be ready",'green'))
all_pods_returned = "False"
while all_pods_returned.find("False") != -1:
    backend_returned = subprocess.check_output("kubectl get pods  -o 'jsonpath={..status.conditions[?(@.type==\"Ready\")].status}' -n backend",shell=True)
    frontend_returned = subprocess.check_output("kubectl get pods  -o 'jsonpath={..status.conditions[?(@.type==\"Ready\")].status}' -n frontend",shell=True)
    all_pods_returned =  backend_returned + " " + frontend_returned

print(colored("Registering admin user",'green'))
payload = {"name":  "admin", "email": "admin@email.com", "password":  "foo"}
make_request("users." + domain,"rpc.AuthService/Register",payload)

print(colored("Confirming admin user",'green'))
xpayload = {"name": "admin","password": "foo"}
make_request("users." + domain,"rpc.AuthService/Login",payload)

# Confirm admin - this is the only user you can confirm this way...
# the others need a real token.
payload = {"token":"admin"}
make_request("users." + domain,"rpc.AuthService/Confirm",payload,1)

print(colored("Registering mark, beth, and wendy (fake email addresses)",'green'))
users = ["Mark", "Beth", "Wendy"]
emails = ["mark@email.com","beth@email.com","wendy@email.com"]
index = 0
for u in users:
    payload = {"name": u, "email": emails[index], "password": "foo"}
    make_request("users." + domain,"rpc.AuthService/Register",payload)
    index = index + 1

print(colored("Registering a message hub for the admin",'green'))
payload = {"name": "admin","password": "foo"}
make_request("users." + domain,"rpc.AuthService/Login",payload)

payload = {"name": "admin","password": "foo"}
make_request("users." + domain,"rpc.AuthService/Login",payload)

message_hub_address = "https://messages." + domain
payload = {"address": message_hub_address ,"details": "hello there", "post_limit":2}
make_request("users." + domain,"rpc.MessageHubService/Register",payload,1)

print(colored("Getting postgres pod name",'green'))
postgres_pod = ""
while postgres_pod == "":
  postgres_pod = subprocess.check_output('kubectl get pods -l app=db-user-hub-service -n backend -o custom-columns=:metadata.name', shell=True)

# Confirm message hub, new users, make them friends
try:
    connection = psycopg2.connect(user="postgres",
                                  password=secret,
                                  host="127.0.0.1",
                                  port="5432",
                                  database="koto-user-hub")
    cursor = connection.cursor()
    
    print(colored("Confirming message hub via direct SQL",'green'))
    print("confirming hub")
    dt = datetime.now(timezone.utc)
    sql_update_query = """Update message_hubs set approved_at = %s, allow_friend_groups = %s"""
    cursor.execute(sql_update_query, (dt, True,))
    connection.commit()

    print(colored("Confirming new users via direct SQL",'green'))
    print("confirming users")
    sql_update_query = """Update users set confirmed_at = %s"""
    cursor.execute(sql_update_query, (dt,))
    connection.commit()

    print(colored("Creating friendships for all users via direct SQL",'green'))
    print("getting users")
    sql_query = """select id from users"""
    cursor.execute(sql_query)
    users = cursor.fetchall()
    users_again = users[:]

    # make all the users friends with one another
    print("making friends")
    for user in users:
        for user_again in users_again:
            if user_again[0] != user[0]:
                sql_insert_query = """insert into friends(user_id,friend_id) values(%s,%s)"""
                print(user[0] + " " + user_again[0])
                cursor.execute(sql_insert_query, (user[0], user_again[0],))
                time.sleep(1)
                connection.commit()

except (Exception, psycopg2.Error) as error:
    print("Error ", error)

finally:
    # closing database connection.
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")

print(colored("Setup complete",'green'))