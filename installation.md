# Installation

## Running your own node

Want to host messages, images, and videos for your friends?

1. Create a Kubernetes cluster on Digital Ocean, Amazon, Google, Azure, etc.
2. Clone this repository
3. Modify .k8s/node/node.yaml
4. Modify .k8s/db/postgres-node-db.yaml
5. Deploy these two deployments with kubectl in a namespace of your choice

## Running an entire koto network

Want to start an entirely new network using your own domain name? 

1. Create a Kubernetes cluster on Digital Ocean, Amazon, Google, Azure, etc.
2. Clone this repository
3. Modify .k8s/node/node.yaml
4. Modify .k8s/frontend/frontend.yaml
5. Modify .k8s/central/central.yaml
6. Modify .k8s/db/postgres-node-db.yaml
7. Modify .k8s/db/postgres-central-db.yaml
8. Run ./deploy.sh

## Local testing

This will use a minio s3 container

```
docker-compose up --build
```

## Running tests

[Run tests](tests.md)

## Modifying secrets
- To create your Central Database password run the following command replacing the `<PASSWORD>` value with your actual password:

```
kubectl create secret generic db-central-password --from-literal=password=123123123 -oyaml --dry-run=client > ./.k8s/db/secret-central-db.yaml
```

- To create your Node Database password run the following command replacing the `<PASSWORD>` value with your actual password:

```
kubectl create secret generic db-node-password --from-literal=password=123123123 -oyaml --dry-run=client > ./.k8s/db/secret-node-db.yaml
```
- To create your Central server secrets run the following command replacing the strings between `<>` with your actual value:

```
kubectl create secret generic central-smtp --from-literal=smtp_user=test --from-literal=smtp_password=test -oyaml --dry-run=client > ./.k8s/central/secret-central-smtp.yaml
```

```
kubectl create secret generic central-s3 --from-literal=s3_key=test --from-literal=s3_secret=test -oyaml --dry-run=client > ./.k8s/central/secret-central-s3.yaml
```

### Generate an RSA key

```
openssl genrsa -out ./central.rsa 1024

kubectl create secret generic central-key --from-file=key=./central.rsa -oyaml --dry-run=client > ./.k8s/central/secret-central-key.yaml
```

- To create your Node S3 key and secret run the following command replacing the `<KEY>` and `<SECRET>` value with your actual password:

```
kubectl create secret generic node-secrets --from-literal=s3_key=test --from-literal=s3_secret=<SECRET> -oyaml --dry-run=client > ./.k8s/node/secret-node.yaml
```