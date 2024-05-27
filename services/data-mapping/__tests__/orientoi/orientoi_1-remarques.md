
* Les entrées de ce fichier sont-elles bien transformées en `soo:Experience` ? 
  ==> oui en experienceType = professional, experienceStatus = suggested  


* Comment est fait la transformation des propriétés `positionnement` dans l'objet `soo:Polarity` ? 2 options:
  - A/ Y-a-t-il une `soo:polarityScale` qui est définie par nous et sur laquelle on mappe les entrées `.positionnement` vers une `soo:PolarityValue` ? (et donc il y a la création d'une fonction particulière pour faire le mapping entre les entrées et la collection mindmatcher)
  - B/ les valeurs de positionnement de Orientoi sont reprises telles quelles (dans PolarityScale). Mais alors quelles sont les valeurs de polarityValue ? 
    ==> créé dynamiquement 


* Quel traitement fait-on pour le "type" dans le fichier orientoi ? Les valeurs des ces types-orientoi peuvent être : Métier, Contexte professionnel, Secteur d'activité, ....
  - faut-il définir une règle dynamique ? 
  =+> rajouter une propriété `category` qui pointe vers soo:Category avec un provider, un skos:concept, etc...  

* Quelle gestion des "id source" ? Reprise telle quelle ou transformation dans des "id translator" ? 
  - ==> regenération des id et conservation de l'id si il existe, ajout d'une propriété `id_source`
  

