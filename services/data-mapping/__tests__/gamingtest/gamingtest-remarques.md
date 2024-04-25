
<<<<<<< HEAD
* La propriété "Results" du fichier original est reprise telle-quelle dans skillLevelValue. Sur la version complète des rules, la fonction de récupération du scale et de la value doit être utilisé.  

* Remarque sur la classe "soo:Skill": 
  - 2/ dans cette transformation, la classe Skill s'avère être surtout une classe de transition/traduction entre la donnée d'entrée et les mappings potentiels dans les référentiels cibles. Quelles sont les propriétés que doivent avoir cette classe ? Les valeurs de prefLabel doivent-elles être copiées ? 


# Remarques générales sur les rules: 
=======
* La relation "hasProfile" entre l'experience et le profile n'existe pas dans l'ontologie SOO, cette relation doit-elle être rajoutée ? 
* La propriété "Results" du fichier original est reprise telle-quelle. Ne doit-elle pas être transformée suivant les concepts de "IndividualChoice" ou "Orientation" ? 
* 2 remarques sur la classe "soo:Skill": 
  - 1/ D'une manière générale, ce n'est pas vraiment une classe de description des skills, mais plutôt des skills qu'a une personne. Peut être faudrait-il trouver un autre nom pour cette classe ("PersonalSkill", "SkillInstance", ...)
  - 2/ dans le cas particulier de la transformation de données, cette classe Skill s'avère être surtout une classe de transition/traduction entre la donnée d'entrée et les mappings potentiels dans les référentiels cibles. 
>>>>>>> 75371fa (spec: add tests for gamingtest transformation)

* Pour la génération des Ids des entitiées générées. 2 options sont explorée ici: 
  - A/ une basée sur la création d'une règles spécifique (comme `mmr:rule-0`)
  - B/ une basée sur la présence d'une propriété `generateId = true` dans une règle (cf règle `mmr:rule-2`)

* Remarques sur la rules `mmr:rule-4`
<<<<<<< HEAD
<<<<<<< HEAD
  * définition d'une relation inverse via `relationNameInverse`
=======
  * !!!!!!!!!!!!!!!!! A faire !!!!!!!!!!!!!!!!! 
=======
  * définition d'une relation inverse via `relationNameInverse`
>>>>>>> d82714d (add some samples)

  
>>>>>>> 75371fa (spec: add tests for gamingtest transformation)

* Le format de date utilisé dans l'ontologie est le [xsd:date](https://tutorialreference.com/xml/xsd/datatypes/xsd-datatype-date). Il correspond au format de date en entrée, il n'y a donc pas de transformation à faire.
