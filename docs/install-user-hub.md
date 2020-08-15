# Installing a central server

If you would like to run your own network, instead of using koto.at, you can use either docker-compose or kubernetes.

## Docker compose

1. Copy docker-compose.yml and .env.template to some folder.
2. Rename .env.template to .env, modify values of variables.
3. Run `docker-compose pull`
4. Run `docker-compose up -d`

## Kubernetes

Note: SSL does not work without some special care and feeding. Since we are using the contour proxy, you can read how to install SSL certificates [here](https://projectcontour.io/guides/cert-manager/). We will gladly take some pull requests if you'd like to incorporate this into our repository.

1. Modify the deployment templates in .k8s/central and ./k8s/frontend
2. Run kubectl apply ./k8s --recursive

