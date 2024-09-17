Commandes pour le déploiement à automatiser dans un script 

cd ariane/services/ontobridgeApi
docker compose build api

docker tag ontobridgeapi-api europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/ontobridge-dev:main
docker push europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos/ontobridge-dev:main

==> reprendre la commande pour update le cloud run


* pour tester en local 

docker compose up api