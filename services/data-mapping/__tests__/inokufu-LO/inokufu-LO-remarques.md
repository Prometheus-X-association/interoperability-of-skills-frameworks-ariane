
<<<<<<< HEAD
<<<<<<< HEAD
* Quels sont les experienceType et experienceStatus de ces learning object ? 
experienceType = educational
experienceStatus = suggested (ou rajouter "available" dans la collection de termes)

* doit-on mapper les propriétés sources suivantes ? keywords, picture, url
  - ou remet-on l'ensemble de l'objet dans une propriété source ? 

on avait parlé de tout mettre dans un objet description. Ce qui nessecite de créer un objet Desciption adhoc dans la SOO

* parsing de la date : comment fait-on pour déterminer les différents format d'entrées ? Quels sont les options natives en python ?

Est-ce que dateTime fonctionne si l'on ne met qu'une date ?

* date: jusque à maintenant on a utilisé xsd:date, mais celui-ci ne permet pas d'indiquer l'heure. Pour indiquer la date et l'heure il faudrait utiliser xsd:dateTime. passe-t-on toutes les dates en dateTime par défaut ? 


* Fait-on un mapping vers Rome ou Esco sur le titre de la formation ? 

Pourquoi pas, mais c'est surtout sur les formacode et les fiches métiers qu'on pourrait faire un mapping
=======
* mappé vers des expériences 
* title = prefLabel 
* ==> creation d'un objet description avec des propriétés de type : image,url, text, keywords, standardDescriptionFile, 
* date = rajouter la propriété refDate
* rajouter une propriété duration à soo:Experience

>>>>>>> 19bb8b6 (feat: start adding other transformation tests)
=======
* Quels sont les experienceType et experienceStatus de ces learning object ? 
experienceType = educational
experienceStatus = suggested (ou rajouter "available" dans la collection de termes)

* doit-on mapper les propriétés sources suivantes ? keywords, picture, url
  - ou remet-on l'ensemble de l'objet dans une propriété source ? 

on avait parlé de tout mettre dans un objet description. Ce qui nessecite de créer un objet Desciption adhoc dans la SOO

* parsing de la date : comment fait-on pour déterminer les différents format d'entrées ? Quels sont les options natives en python ?

Est-ce que dateTime fonctionne si l'on ne met qu'une date ?

* date: jusque à maintenant on a utilisé xsd:date, mais celui-ci ne permet pas d'indiquer l'heure. Pour indiquer la date et l'heure il faudrait utiliser xsd:dateTime. passe-t-on toutes les dates en dateTime par défaut ? 

<<<<<<< HEAD
* Fait-on un mapping vers Rome ou Esco sur le titre de la formation ? 
>>>>>>> 401ba52 (feat: add a first version of inokufu-lo)
=======

* Fait-on un mapping vers Rome ou Esco sur le titre de la formation ? 

Pourquoi pas, mais c'est surtout sur les formacode et les fiches métiers qu'on pourrait faire un mapping
>>>>>>> 671e853 (Update inokufu-LO-remarques.md)
