FROM        alpine:3.7
ARG         VERSION=1.52.0
RUN         wget -q https://github.com/digitalocean/doctl/releases/download/v$VERSION/doctl-$VERSION-linux-amd64.tar.gz && \
            tar xf doctl-$VERSION-linux-amd64.tar.gz && \
            mv doctl /usr/local/bin && \
            chmod +x /usr/local/bin/doctl
ENTRYPOINT  ["doctl"]
