# Host an entire Koto network

If you would like to run your own network, instead of using koto.at, and the koto mobile apps, you can install everything by yourself using either docker-compose or kubernetes (documentation coming soon).

## Docker compose

1. Copy docker-compose.yml and .env.template to some folder.
2. Rename .env.template to .env, modify values of variables.
3. Run `docker-compose pull`
4. Run `docker-compose up -d`

