Peacenik is an ad-free, hate-free, distributed social network

# Documentation 

See the docs [here](https://about.peacenik.app).

# Install Peacenik as a k8s demo

Peacenik makes a great demo application for Kubernetes. All you need is a valid Domain name, access to your DNS records, and an S3 compatible bucket.

To install Peacenik on your k8s cluster:

1. Clone this repo to your laptop
2. Make sure kubectl is targeting your cluster
3. Change directores `cd peacenik/.k8s/demo`
4. Modify the settings via `nano settings.toml`
5. Run `python launcher.py`

Everything should be up and running in a minute or so.

