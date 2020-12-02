FROM        alpine:3.7
ARG         VERSION=1.19.4
RUN         wget -q https://storage.googleapis.com/kubernetes-release/release/v$VERSION/bin/linux/amd64/kubectl -O /usr/local/bin/kubectl && \
            chmod +x /usr/local/bin/kubectl
ENTRYPOINT  ["kubectl"]