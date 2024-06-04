
<<<<<<< HEAD
<<<<<<< HEAD
* est-ce ok, le parsing des sessions en array de dateFrom, dateTo ? 
  * A noter ailleurs: il y a encore la problématique du parsing de la date : utilise-t-on un paramètre ou une fonction parsing "maline" ?
    - documentation sur les 3 principaux type de structure de dates: https://knowadays.com/blog/date-format-variations-little-endian-middle-endian-big-endian/

* pour les codesRomes ==> création d'un objet catégory, si code-Rome à traiter sous la forme d'un aligment/ mapping 
  * ==> a rediscuter, les codes romes indiqués dans ces formations correspond à un métier cible identifié par les rédacteurs de la formation. Ce n'est pas vraiment la même chose que des métiers identifiés par un algorithme dans le texte de la formation
=======
* mappé en soo:Experience avec experienceType = educational, experienceStatus = suggested 
* inokufu.id => id_source 
* inokufu.title => prefLabel 

* pour les codesRomes ==> création d'un objet catégory, si code-Rome à traiter sous la forme d'un aligment/ mapping 

>>>>>>> 19bb8b6 (feat: start adding other transformation tests)
=======
* est-ce ok, le parsing des sessions en array de dateFrom, dateTo ? 
  * A noter ailleurs: il y a encore la problématique du parsing de la date : utilise-t-on un paramètre ou une fonction parsing "maline" ?
    - documentation sur les 3 principaux type de structure de dates: https://knowadays.com/blog/date-format-variations-little-endian-middle-endian-big-endian/

* pour les codesRomes ==> création d'un objet catégory, si code-Rome à traiter sous la forme d'un aligment/ mapping 
  * ==> a rediscuter, les codes romes indiqués dans ces formations correspond à un métier cible identifié par les rédacteurs de la formation. Ce n'est pas vraiment la même chose que des métiers identifiés par un algorithme dans le texte de la formation
>>>>>>> 6242c56 (feat: add inokufu training parsing)

* Question à réfléchir: 
  * possibilité de mettre en lien / d'implementer les ontologies existantes (lheo, nodefr, hrxml, ...) ?
    - feature: mapping automatique du lheo vers l'ontologie lheo et/ou les propriétés soo 
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6242c56 (feat: add inokufu training parsing)
    - ==> choix actuel: création d'un rule "keep-source-data" 
    - ==> pour copier l'ensemble du fichier, nécessite la création d'une propriété spéciale pour le sourcePath (`.`). Example : `"sourcePath": "."`
    

<<<<<<< HEAD
=======
>>>>>>> 19bb8b6 (feat: start adding other transformation tests)
=======
>>>>>>> 6242c56 (feat: add inokufu training parsing)

  