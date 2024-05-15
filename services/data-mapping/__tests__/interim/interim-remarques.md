- Présence de champs nestés (représentés aaa.vvv)
- Présence de 3 objets expérience différents (pastExperience, Certifications, suggestedExperiences)
    - Comment préciser le type de chaque expérience dans les rules (Création d'objets ?)
    - Quels champs d'expériences créer ou ignorer (nom de l'entreprise, adresse ...)?
    - Qu'est ce que cela implique pour les objets reliés (profile <-> experience) ?

- propriétées ajoutées à soo:Expérience: 
    - soo:company: xsd:string
    - soo:location: xsd:string 
    - soo:contractType: xsd:string ==> doit-on ajouter ça ? Sous forme de string ou de référentiel ? 
    
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
        