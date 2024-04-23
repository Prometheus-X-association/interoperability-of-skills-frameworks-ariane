
* La relation "hasProfile" entre l'experience et le profile n'existe pas dans l'ontologie SOO, cette relation doit-elle être rajoutée ? 
* La propriété "Results" du fichier original est reprise telle-quelle. Ne doit-elle pas être transformée suivant les concepts de "IndividualChoice" ou "Orientation" ? 
* 2 remarques sur la classe "soo:Skill": 
  - 1/ D'une manière générale, ce n'est pas vraiment une classe de description des skills, mais plutôt des skills qu'a une personne. Peut être faudrait-il trouver un autre nom pour cette classe ("PersonalSkill", "SkillInstance", ...)
  - 2/ dans le cas particulier de la transformation de données, cette classe Skill s'avère être surtout une classe de transition/traduction entre la donnée d'entrée et les mappings potentiels dans les référentiels cibles. 

* Pour la génération des Ids des entitiées générées. 2 options sont explorée ici: 
  - A/ une basée sur la création d'une règles spécifique (comme `mmr:rule-0`)
  - B/ une basée sur la présence d'une propriété `generateId = true` dans une règle (cf règle `mmr:rule-2`)

* Remarques sur la rules `mmr:rule-4`
  * !!!!!!!!!!!!!!!!! A faire !!!!!!!!!!!!!!!!! 

  

* Le format de date utilisé dans l'ontologie est le [xsd:date](https://tutorialreference.com/xml/xsd/datatypes/xsd-datatype-date). Il correspond au format de date en entrée, il n'y a donc pas de transformation à faire.
