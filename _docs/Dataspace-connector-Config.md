
# RUN : 

* as local 
pnpm run dev 

* as docker: 
docker compose up dataspace-connector

# DEPLOY 
## THE dsp-dcons
PORT=8080 docker compose build dataspace-connector
docker tag dataspace-connector-dataspace-connector europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp:main
docker push europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp:main
gcloud run deploy dsp-dcons-dev --project=ariane-develop --image=europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp:main --region=europe-west1


## THE dsp-dprov
PORT=8080 docker compose build dataspace-connector
docker tag dataspace-connector-dataspace-connector europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp-provider:main
docker push europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp-provider:main
gcloud run deploy dsp-dprov-dev --project=ariane-develop --image=europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp-provider:main --region=europe-west1

# script 

## 1/ build the generic container
cd services/dataspace-connector
git pull 
PORT=8080 docker compose build dataspace-connector
docker tag dataspace-connector-dataspace-connector europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsc-generic:main

## 2/ build the local container with parameters

cd services/dsc/container
docker build -f Dockerfile ../

!!!! A rendre dynamique toutes les variables

docker build --build-arg ENV_FILE=../consumer/.env --build-arg ENV_FILE_DEV=../consumer/.env.development --build-arg JSON_DEV=../consumer/config.development.json -f Dockerfile -t europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp-consumer:main ../ 

docker push europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp-consumer:main
gcloud run deploy dsp-dcons-dev --image=europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/dsp-consumer:main --project=ariane-develop --region=europe-west1







# Question to PTX 

* working configuration ? 
* docker node 16 vs node 20 (node 16 unsupported with the last version of pnpm)
* local run 
  - full localhost ? 
  - mongodb connexion that do not work *inside* local docker (but ok on localhost).

* How to implement effective connexions between: 
  - dsc & data-consumer ? 
  - dsc & data-provider ? 


# coté data-provider 
- Service offering avec data-ressource
  - data-ressource à mettre à jour le endpoint get: Representation
      Specify where and how the data resource you want to integrate is retrieved by other participants through the Data Space Connector. You can come back to this later!

- coté data-consumer:
  - service-ressource avec un ndpoint de post 



* pour lancer un échange: https://catalog.visionstrust.com/dashboard/catalog/serviceoffering/65a7bae18febe75622524679
  ==> en tant que consumer

* Authentication/login
  - récupérer le jwt
* le mettre dans authorize
* faire tourner /private/configuration/reload
* vérifier dans /private/configuration/



* pour la configuration des bases de données, il faut rajouter le nom de la base de données en fin du connexion string (exemple: /consumer)
  - MONGO_URI=mongodb+srv://ariane-admin:vNzAEnT4tR4iy1AZ@ariane-connectors.9vyzmmm.mongodb.net/consumer?retryWrites=true&w=majority&appName=ariane-connectors


#####
==> on ne sait pas non plus de quel service offering 