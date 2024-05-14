<<<<<<< HEAD
- Question sur le fichier structure: il n'y a pour l'instant que la valeur `openToInterim` qui donne lieu à une transformation sous forme de référentiel. Mais c'est une valeur numérique et rattachée au profil et non à une expérience. Comment traite-t-on ce cas: 
    - au niveau du fichier de structure ?
    - au niveau du rattachement de la propriété à l'expérience ? (voir question ci-dessous)

- @Bart: Validation des règles sur les expérienceType et experienceStatus 
example de règles: 
```json
{
    "id": "mmr:rule-15",
    "sourcePath": "jobCards.id",
    "targetClass": "soo:Experience",
    "targetProperty": "soo:experienceType",
    "targetValue": "term:experience/type/professional"
},
{
    "id": "mmr:rule-16",
    "sourcePath": "pastExperience.role",
    "targetClass": "soo:Experience",
    "targetProperty": "soo:experienceStatus",
    "targetValue": "term:experience/status/suggested"
}
```
- @Bart: comment fait-on pour le champs "certifications" ? On créé aussi des règles sur les expérienceType & status ? 

- @TODO: rajouter les entitées qui décrivent les expérienceTypes et status dans les fichiers d'output 
```
"experienceType": "term:experience/type/professional",
"experienceStatus": "term:experience/type/suggested"
```

- Ne proposons nous pas de matching pour les Expériences issues des valeurs de l'interim ? 



- sur la propriété `.openToInterim` & `soo:Polarity`: 
    - 0/ la polarité est un bon moyen de modéliser cette information ?
    - 1/ la polarité n'est pas liée à une experience, mais à un profil. est-ce un problème ? 
    - 2/ quid de la gestion du référentiel des polarité ? 

- définition des relations entre le profil et les expériences : 2 options peuvent être identifiées: 
    - a) C'est au niveau du profil que l'on définit la relation avec les les expériences. l'avantage est que cette relation n'est définie qu'une seule fois, l'inconvénient c'est que cette relation / ce traitement doit être gardé en mémoire et appliqué à chaque création de la classe targétée. Example de règle pour l'option: 
        ```json
        {
            "id": "mmr:rule-0",
            "targetClass": "soo:Profile",
            ...
            "relationTo": "soo:Experience",
            "relationName": "soo:experience",
            "relationNameInverse": "soo:profile"
        }
        ```
    - b) C'est au niveau des expériences que l'on définit la relation avec le profil. l'avantage est que cette relation peut être plus facilement déduite / suggérée lors de la construction des règles et que l'application de cette règles est plus simple car liée à l'objet courant. L'inconvenient est la répétition de cette règle lorsque qu'il y a plusieurs objets (experiences) liées. Examplede rgèle pour l'option:
    ```json
    {
        "id": "mmr:rule-3",
        "targetClass": "soo:Experience",
        ...
        "relationTo": "soo:Profile",
        "relationName": "soo:profile",
        "relationNameInverse": "soo:experience"
    }
    
    ```  

# Remarque générale sur les rules : 

* Ajout de la propriété suivante pour le traitement des dates : `"targetFunctionParam": "fno:year-only"`
    - 2 options pour le traitement de la diversité des dates: a) des fonctions particulières pour chaque format d'entrées ou b) une seule fonction avec des paramètres différents en fonction du format d'entrée. 
        
=======
- Présence de champs nestés (représentés aaa.vvv)
- Présence de 2 objets expérience différents (past and suggested)
>>>>>>> 9d23288 (Renamed Proman to interim)
