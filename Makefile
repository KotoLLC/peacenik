.SILENT:
.DEFAULT_GOAL := help

COLOR_RESET = \033[0m
COLOR_COMMAND = \033[36m
COLOR_YELLOW = \033[33m
COLOR_GREEN = \033[32m
COLOR_RED = \033[31m

PROJECT := ORBITS
DIRECTORY := .k8s/minikube

## Build all the images
build:
	$(eval $(minikube docker-env))
	docker build --tag frontend ./frontend -f ./frontend/Dockerfile.production
	docker build --tag message-hub ./backend -f ./backend/messagehub/Dockerfile
	docker build --tag user-hub ./backend -f ./backend/userhub/Dockerfile

## Apply the K8s manifests to your cluster
apply: build
	$(eval $(minikube docker-env))
	kubectl apply -f ${DIRECTORY}/namespaces
	kubectl apply -f ${DIRECTORY}/ -R
	kubectl wait --for=condition=available --timeout=600s deployment --all -n backend
	kubectl wait --for=condition=available --timeout=600s deployment --all -n frontend

## Cleanup the deployments
cleanup:
	kubectl delete -f ${DIRECTORY} -R

## Prints help message
help:
	printf "\n${COLOR_YELLOW}${PROJECT}\n------\n${COLOR_RESET}"
	awk '/^[a-zA-Z\-\_0-9\.%]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "${COLOR_COMMAND}$$ make %s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST) | sort
	printf "\n"