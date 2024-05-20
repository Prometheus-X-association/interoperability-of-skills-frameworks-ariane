
<<<<<<< HEAD
<<<<<<< HEAD

* Traite-t-on la propriété `"isTension": true,` ? 
  - questions pour Bart

* Comment fait-on pour la notion de "mapping" au niveau de l'expérience name, etc : utilise-t-on une propriété `mapping` ? (comme actuellement) ou fait-on le merge des propriétés (mais alors on a le pb de l'id du mapping) ? (voir ci dessous pour les 3 options)
  -=> définissons nous des paramètres pour la fonction "fno:search-for-mapping-with-source" ? Pour disposer de la description par example dans l'algorithme. 


==> récupération des name et description dans le sso:Expérience + enrichissement via des mappings 


==> pour le Lheo, etc: voir pour créer une objet de wrapper pour les valeurs originales


## Options 1 : (uniquement mappings)
```json
{
  "id": "tr:__experience-1__",
  "mapping": ["tr:mapping-1", "tr:mapping-2","..."],
},

{
  "id": "",

}

```
## options 2: (uniquement "merge" des propriétées)
```json
{
  "id":"tr:__experience-1__",
  "prefLabel": {"@value": "--intitulé du mapping ESCO", "@language": "fr"}
}
```
## option 3: (mapping + merge)
```json
{
  "id": "tr:__experience-1__",
  "prefLabel": {"@value": "--intitulé du mapping ESCO", "@language": "fr"},
  "mapping": ["tr:mapping-1", "tr:mapping-2","..."]
}
```
  

# Documentation 

* Les "id source" des objets source sont conservés dans la propriété `soo:idSource`. Un id specifique est généré pour les objets transformés.

* Les entrées de ce fichier sont transformées en `soo:Experience` et les valeurs des propriétés suivantes sont fixées : 
  - `soo:experienceType` = professional
  - `soo:experienceStatus` = suggested  

* La fonction `fno:get-polarity-value` permet la transformation de la proprité source `positionnement` dans l'objet `soo:Polarity`.
  - Cette fonction fait le mapping entre les valeurs de `positionnement` et les valeurs créées dynamiquement (si elle n'existent pas) des `soo:PolarityValue` spécifiques au provider. Ces `soo:PolarityValue` sont associées à une `soo:polarityScale` elle aussi spécifique au provider. 
  - cette fonction ajoute par défaut une propriété `soo:polarity` au target-object 

* La fonction `fno:get-category-value` est aussi une fonction dynamique de mapping vers des `soo:Category`
  - cette fonction ajoute par défaut une propriété `soo:category` au target-object
=======
* Les entrées de ce fichier sont-elles bien transformées en `soo:Experience` ? 
  ==> oui en experienceType = professional, experienceStatus = suggested  

=======
>>>>>>> 13b4f7e (feat: first version of orientoi)

* Traite-t-on la propriété `"isTension": true,` ? 
  - questions pour Bart

* Comment fait-on pour la notion de "mapping" au niveau de l'expérience name, etc : utilise-t-on une propriété `mapping` ? (comme actuellement) ou fait-on le merge des propriétés (mais alors on a le pb de l'id du mapping) ? (voir ci dessous pour les 3 options)
  -=> définissons nous des paramètres pour la fonction "fno:search-for-mapping-with-source" ? Pour disposer de la description par example dans l'algorithme. 


==> récupération des name et description dans le sso:Expérience + enrichissement via des mappings 

<<<<<<< HEAD
* Quelle gestion des "id source" ? Reprise telle quelle ou transformation dans des "id translator" ? 
<<<<<<< HEAD
>>>>>>> 834d5f9 (Resolve "propose a clean rule file with respect to clean original SOO version")
=======
  - ==> regenération des id et conservation de l'id si il existe, ajout d'une propriété `id_source`
  

>>>>>>> 19bb8b6 (feat: start adding other transformation tests)
=======

==> pour le Lheo, etc: voir pour créer une objet de wrapper pour les valeurs originales


## Options 1 : (uniquement mappings)
```json
{
  "id": "tr:__experience-1__",
  "mapping": ["tr:mapping-1", "tr:mapping-2","..."],
},

{
  "id": "",

}

```
## options 2: (uniquement "merge" des propriétées)
```json
{
  "id":"tr:__experience-1__",
  "prefLabel": {"@value": "--intitulé du mapping ESCO", "@language": "fr"}
}
```
## option 3: (mapping + merge)
```json
{
  "id": "tr:__experience-1__",
  "prefLabel": {"@value": "--intitulé du mapping ESCO", "@language": "fr"},
  "mapping": ["tr:mapping-1", "tr:mapping-2","..."]
}
```
  

# Documentation 

* Les "id source" des objets source sont conservés dans la propriété `soo:idSource`. Un id specifique est généré pour les objets transformés.

* Les entrées de ce fichier sont transformées en `soo:Experience` et les valeurs des propriétés suivantes sont fixées : 
  - `soo:experienceType` = professional
  - `soo:experienceStatus` = suggested  

* La fonction `fno:get-polarity-value` permet la transformation de la proprité source `positionnement` dans l'objet `soo:Polarity`.
  - Cette fonction fait le mapping entre les valeurs de `positionnement` et les valeurs créées dynamiquement (si elle n'existent pas) des `soo:PolarityValue` spécifiques au provider. Ces `soo:PolarityValue` sont associées à une `soo:polarityScale` elle aussi spécifique au provider. 
  - cette fonction ajoute par défaut une propriété `soo:polarity` au target-object 

* La fonction `fno:get-category-value` est aussi une fonction dynamique de mapping vers des `soo:Category`
  - cette fonction ajoute par défaut une propriété `soo:category` au target-object
>>>>>>> 13b4f7e (feat: first version of orientoi)
