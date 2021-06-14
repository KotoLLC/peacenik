# If you want to use a real email server, just change these values:
smtphost="smtp.dummy.org"
smtpuser="dummy"
smtppassword="dummy"
smtpport="587"
smtpemail="dummy@dummy.org"



file=secret.txt
if test -f "$file"
then
    secret=$(cat secret.txt)
else
    secret=$(openssl rand -base64 12) > secret.txt
fi

echo "${green}"
echo "Universal secret:"
echo ${secret}
echo "-----------------------"
echo "${reset}"



green=`tput setaf 2`
reset=`tput sgr0`
echo "${green}"
echo "Installing Cert Manager"
echo "-----------------------"
echo "${reset}"
helm repo add jetstack https://charts.jetstack.io
helm repo update  
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.0  --set installCRDs=true
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm upgrade --install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
external_ip=""
while [ -z $external_ip ]; do
    echo "${green}"
    echo "Waiting for external IP"
    echo "-----------------------"
    echo "${reset}"
    external_ip=$(kubectl get svc nginx-ingress-ingress-nginx-controller --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}")
    [ -z "$external_ip" ]
    sleep 5
done
echo "${green}"
echo "End point ready:" && echo $external_ip
echo "Please create two DNS records for this IP:"
echo "1) an A record"
echo "2) a wildcard subdomain record"
echo "Enter the domain name when ready: "
read domain
echo "${reset}"
messagehub="messages.${domain}"
userhub="users.${domain}"
minio="minio.${domain}"
frontend="${domain}"
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<MESSAGE-HUB-ADDRESS>|https://${messagehub}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<MESSAGE-HUB-NO-PROTOCOL-ADDRESS>|${messagehub}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<USER-HUB-ADDRESS>|https://${userhub}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<USER-HUB-NO-PROTOCOL-ADDRESS>|${userhub}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<MINIO-ENDPOINT>|https://${minio}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<MINIO-ENDPOINT-NO-PROTOCOL-ADDRESS>|${minio}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<FRONTEND-ADDRESS>|https://${frontend}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<FRONTEND-NO-PROTOCOL-ADDRESS>|${frontend}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<SMTP-HOST>|${smtphost}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<SMTP-USER>|${smtpuser}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<SMTP-EMAIL>|${smtpemail}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<SMTP-PASSWORD>|${smtppassword}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<SMTP-PORT>|${smtpport}|g" {} \;
find ./ -type f -name "*.yaml" -exec sed -i '' "s|<SECRET>|${secret}|g" {} \;

echo "${green}"
echo "Deploying Peacenik"
echo "-----------------------"
echo "${reset}"
kubectl apply -f namespaces/
sleep 3
kubectl create secret generic user-hub-key --from-literal=password="${secret}" -n backend
kubectl apply -f backend/
sleep 3
kubectl apply -f frontend/
sleep 3
kubectl apply -f ingress/
sleep 3
kubectl apply -f cert-manager/
sleep 3


echo "${green}"
echo "-----------------------"
echo "Done"
echo "${reset}"
