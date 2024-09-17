# @TODO: use venv and stage build to only get compiled python deps: https://stackoverflow.com/a/48562835
FROM node:21-alpine as base

# * faire l'issue pour adam pour automatiser le check de: _ops/pscipt/versionCheck.js



## Args - after `from`
## see `Scope of build-args` in https://docs.docker.com/compose/compose-file/compose-file-v3/#args
## it explain why args are in 2 places
ARG DEPLOY_PATH_LOCAL
ARG DEPLOY_PATH_DOCKER
ARG CONF_FOLDER

## JS
# install pnpm and global deps
RUN npm install -g pnpm nodemon

# root folder conf
WORKDIR /app

# service copy 
## only one service for now, create a dynamic zone if multiple py-projects
## @TODO: optimize the layers building with a separate copy for service's node_modules
# Try with matchpy service so it will be rebuild only on python changes (and it's big for now)
# COPY ${DEPLOY_PATH_LOCAL}services/matchpy/scripts/knnSearches/requirements.txt ${DEPLOY_PATH_DOCKER}services/matchpy/scripts/knnSearches/requirements.txt
# RUN pip install -r ./services/matchpy/scripts/knnSearches/requirements.txt --no-cache-dir

# Try with matchpy service so it will be rebuild only on python changes (and it's big for now)
# COPY ${DEPLOY_PATH_LOCAL}services/matchpy ${DEPLOY_PATH_DOCKER}services/matchpy


# full copy, check if previous partials ones improve the perf & size
COPY ${DEPLOY_PATH_LOCAL} ${DEPLOY_PATH_DOCKER}



# CMD ["sleep", "infinity"]
CMD ["pnpm", "run", "prod:serve"]

# This is the config into the aggregated app that give the config for now
# @TODO: restaure override for publishing to specific target ? 
FROM base as dev 
# COPY ${CONF_FOLDER}/dev.config.yaml ./_confs/config.yaml

FROM base as preprod
# COPY ${CONF_FOLDER}/preprod.config.yaml ./_confs/config.yaml

FROM base as prod
# COPY ${CONF_FOLDER}/prod.config.yaml ./_confs/config.yaml
