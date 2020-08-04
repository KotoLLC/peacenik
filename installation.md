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
