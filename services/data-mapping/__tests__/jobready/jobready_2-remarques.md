* Fichiers de règles et d'output 
  - 2 types de fichiers de règles sont créés : un `-structure` qui ne définit que des transformations sur la structure, et un fichier sans suffixe définissant une transformation sur la structure et le contenu 


# Remarque pour les règles job-ready avec transformation
* Question @Bart 
  - doit-on rattacher ces compétences "dans le vent" dans le fichier original vers des `soo:Experiences` : chaque entrée est une expérience
  - comment modélise-t-on fields.context dans la SOO ? ==> c'est un "type d'expérience" : a mettre tel quel
  - comment modélise-t-on fields.level dans la SOO ? 
     ==> construction dynamique en fonction des entrées 
  - comment modélise-t-on name & table dans la SOO ? (si ce doit être modélisé) ==> pas à transformer