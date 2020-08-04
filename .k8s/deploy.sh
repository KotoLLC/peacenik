#!/bin/bash
set -eo pipefail

BACKEND_NAMESPACE="backend"

_wait_for_deployments() {
    NAMESPACE=${1}
    kubectl wait --for=condition=available --timeout=600s deployment \
        --all -n ${NAMESPACE}
}

deploy() {
    echo "Applying Postgres DB resources"
    kubectl apply -f ./db --dry-run
    echo "======================================================="
    echo "Waiting for Postgres DB resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}

    echo
    echo "==============================="
    echo "Applying Koto Central resources"
    kubectl apply -f ./central --dry-run
    echo "======================================================="
    echo "Waiting for Koto Central resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}

    echo
    echo "============================"
    echo "Applying Koto Node resources"
    kubectl apply -f ./node --dry-run
    echo "======================================================="
    echo "Waiting for Koto Node resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}

    echo
    echo "================================"
    echo "Applying Koto Frontend resources"
    kubectl apply -f ./frontend --dry-run
    echo "======================================================="
    echo "Waiting for Koto Frontend resources to become available"
    # wait for the pods to be available
    _wait_for_deployments ${BACKEND_NAMESPACE}
}

case "$1" in
deploy)
    deploy
    ;;
*)
    echo $"Usage: $0 {deploy}"
    exit 1
    ;;

esac
