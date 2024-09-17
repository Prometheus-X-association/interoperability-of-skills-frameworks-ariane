
* Documentation: 
  * présentation générale: https://mail.google.com/mail/u/0/#inbox/FMfcgzGxRfHGPfWkpkhKXnLGXFWXMqzj?compose=DmwnWrRrkqdsPQtDLJQXCkWhMMJknRrlVZkmmXvrQDCWbcGJrBvVNhvSfhffqwLqbxZdZjcBrJsb
  * The full documentation on exchanges between actors: https://visionstrust.com/public/docs#webApp
  * Please note that we are `interop` module is a bit specific in this general flow. The specific requirements are described here: https://visionstrust.com/public/docs#infrastructureServices
  * 

* Une première implémentation a été réalisée en 2021
  * cette implémentation c'est basée sur les endpoints d'api gatsby
  * La définition des endpoints `concent` et `data` se trouvent ici: https://gitlab.com/mmorg/ismene/-/blob/03465e9f2d298f1fa592a602c6b81a915d8c1f42/gatsby/src/api
  * L'implementation de la transformation est ici. Cette implementation est `deprecated` https://gitlab.com/mmorg/ismene/-/blob/devonline/gatsby/src/visionsTrust
  

* 
  * deploy script: https://gitlab.com/mmorg/ismene/-/blob/c403337d4b8d98cc8c52a1ee7d1df4407402faaa/gatsby/buildAndPublish-interop.sh
  * online instance: https://console.cloud.google.com/run/detail/europe-west1/ismene/logs?project=ismene
  



- The recording of the meeting: https://drive.google.com/file/d/1gpvATM7xL2O27xxxB9gcgy0axPTmRMNp/view?usp=sharing
- Data Space Connector Github Repository: https://github.com/Prometheus-X-association/dataspace-connector
- documentation on DSC with endpoint config: https://docs.google.com/presentation/d/1JFTT4GhlxoDj9r_1vjKbOvD4gJvUwAR1i37wyszwiiE/edit#slide=id.g2b923cec4d0_0_641

# Infrastructure: 
* plusieurs connector pour chaque composant (provider connector & data consumer connector)
  * comment on l'install ? 

* comment on fait pour mettre en place un environement de test ? 
* Quels sont les actions concrêtes pour installer un connector ? 
  * En attente de documentation de Félix pour 1/ configurer un service & 2/ configurer pour Visions
  * pour le mongodb: https://console.cloud.google.com/marketplace/product/mongodb/mdb-atlas-self-service?_ga=2.115139648.-616712600.1646069635&pli=1&project=dashemploi
    * https://cloud.google.com/mongodb


* 1 seul connector pour différents services





# Connector question 
* comment on fait passer des options pour le service d'intéropérabilité ? 
  * 

* Differences from IDSA :
  * IDSA is mostly a specification
  * IDSA is based on eclipse plugin, but the plugin is complex, do not manage some usecases 
