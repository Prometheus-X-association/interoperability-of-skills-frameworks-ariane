# Use the official Node.js image as base image
FROM europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsc-generic:main

ARG ENV_FILE
ARG ENV_FILE_DEV
ARG JSON_DEV 
# COPY ../consumer/.env /usr/src/app/.env
# COPY ../consumer/.env.development /usr/src/app/.env.development
# COPY ../consumer/config.development.json /usr/src/app/src/config.development.json

COPY ${ENV_FILE} /usr/src/app/.env
COPY ${ENV_FILE_DEV} /usr/src/app/.env.development
COPY ${JSON_DEV} /usr/src/app/src/config.development.json
