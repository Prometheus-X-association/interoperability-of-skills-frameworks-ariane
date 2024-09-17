<<<<<<< HEAD
<<<<<<< HEAD
=======
url: https://catalog.visionstrust.com/dashboard/home

Vision trust primary connexion (with @asia login)
  - login: @asia
  - role : DataProvider 
  - on ressource: jobs & skills framework: https://catalog.visionstrust.com/dashboard/profile/my-offerings/resources/data/65a7aecc803a86420c549e5c (==> a vérifier si c'est avec lui que le contrat a été passé)
  - serviceKey: USyMyRxLMa3ZKoEMYsO3JLCouc5vg6iIMmhxwv1US2nlDisgov2BBVU43SMWmqBAovuBVvKQ3nXY5Tm87Pcl9NAiiJ7vp76RLURu
  - secretKey: cAQm3B3SMgXMw2nyWsaP3GaCbvsVTek5NJ9cqEYWzhIHAzqvzFQEnnm21maJSleUUF1g5ZFiTlG_3tb4vhgTmO7vyrN2o8iPLpvS
  - @TODO: get the orgName & service/secret Keys

  - url: https://fake-app-devonline-crg6fqyj3q-ew.a.run.app/provider/data
  

vision trust secondary connexion: 
  - login: fa+visiontrust@mindmatcher.org
  - pwd: $!7sBTePhX9#6b3G
  - role: DataConsumer
  - orgname: preprod-test-mm
  - serviceKey: FtTQMIEaI0Qj3_sSmx21b6NdXMYxTuGNDmyzRJKdtgevWyvuqz0dbQ6HYI0CfWNbIMrh7AmZBxeSqLH4t3rxk0SVoxCbIljM8idk
  - secretKey: EoDzchhr4snubWrMBIzChUJ6XGLf9iU888sWce4b80y8Nqr6h_nxeikE0q9W2jhE4Amc_cVUXlhyXPs9G6oYGCYBhCQ6TcB4VNDa
  - url: https://fake-app-devonline-crg6fqyj3q-ew.a.run.app/consumer/data


Pour initier un échange : 
  - via l'interface: se connecter en tant que DataConsumer et aller sur la page du DataProvider / ServiceProvider sur le catalogue: https://catalog.visionstrust.com/dashboard/catalog/serviceoffering/65a7bae18febe75622524679
  - via api: voir la documentation suivante: https://github.com/Prometheus-X-association/dataspace-connector/blob/main/docs/DATA_EXCHANGE.md#how-to-trigger-a-b2b-data-exchange-through-the-api-connector
  

  
# Bdd mongo: 
- ariane-admin
- vNzAEnT4tR4iy1AZ

- connexion string: mongodb+srv://ariane-admin:vNzAEnT4tR4iy1AZ@ariane-connectors.9vyzmmm.mongodb.net/?retryWrites=true&w=majority&appName=ariane-connectors

- service url : 
  - via mongo: https://cloud.mongodb.com/v2/660fae1c1c9e685302dbab8f#/overview
  - via gcp : // rattaché à un ancien projet, voir si besoin de le rattacher au projet ariane-dev //
  
>>>>>>> f9f4968 (chore: docs)
=======
>>>>>>> 700b0eb (doc)

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