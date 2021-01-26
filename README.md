Koto is an ad-free, hate-free, distributed social network

# About the project

You can read more about Koto [here](https://docs.koto.at).

# API Reference

API is documented [here](api.md).

# Testing

Koto can be tested as follows:

1. install minikube
2. run `minikube addons enable ingress`
3. run `eval $(minikube docker-env)`
4. run `minikube ip` and copy the ip address
5. in /.k8s/minikube/backend replace hostAliases.ip with the ip address
6. run `make apply` from koto root
7. Add hosts to /etc/hosts with minikube ip like this:
```
192.168.64.10 node1.orbits.local
192.168.64.10 central.orbits.local
192.168.64.10 orbits.local
```
7. You should be able to browse to http://orbits.local
