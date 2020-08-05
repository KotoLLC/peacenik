#!/bin/bash
set -eo pipefail

BACKEND_NAMESPACE="backend"
FRONTEND_NAMESPACE="frontend"

_wait_for_deployments() {
    NAMESPACE=${1}
    kubectl wait --for=condition=available --timeout=600s deployment \
        --all -n ${NAMESPACE}
}

deploy() {
    echo "Creating namespaces"
    kubectl apply -f ns.yaml

    echo
    echo "==============================="
    echo "Applying Postgres DB resources"
    kubectl apply -f ./db -n ${BACKEND_NAMESPACE}
    echo "====================================================="
    echo "Waiting for Postgres DB resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}

    echo
    echo "==============================="
    echo "Applying Koto Central resources"
    kubectl apply -f ./central -n ${BACKEND_NAMESPACE}
    echo "====================================="
    echo "Waiting resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}

    echo
    echo "============================"
    echo "Applying Koto Node resources"
    kubectl apply -f ./node -n ${BACKEND_NAMESPACE}
    echo "====================================="
    echo "Waiting resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}

    echo
    echo "================================"
    echo "Applying Koto Frontend resources"
    kubectl apply -f ./frontend -n ${FRONTEND_NAMESPACE}
    echo "====================================="
    echo "Waiting resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}
}

destroy() {
    echo "Deleting all the Koto resources"
    kubectl delete -f . -R
}

case "$1" in
deploy)
    deploy
    ;;
destroy)
    destroy
    ;;
*)
    echo $"Usage: $0 {deploy|destroy}"
    exit 1
    ;;

esac
