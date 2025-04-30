# Interoperability of Skills Frameworks Building Block - ISF BB

- PTX project name : Ariane 
- Contractor : MindMatcher


This repository has two components : 
- **AI Translator** : The Edge Translator component is used for translating input data format and value to a standard output. The main benefit of the Translator lies in its ability to ensure the interoperability of jobs, skills and qualifications data. The AI Translator is able to receive skills data from a single or multiple sources through an API and translate it into the requested output format/language in real time. The skills framework translations may include any national one to the international ESCO, between almost all the European languages, as well as any Json data structure to Json-ld.

- **Skill Tagging** : Cette API permet d'extraire des compétences depuis une description de formation et de les enrichir via un système de feedback humain. Les suggestions sont générées à l'aide d'OpenAI et Elasticsearch.

## Run the project

```bash
# Copy env files
cp ai-translator/ui/.env.dist ai-translator/ui/.env && \
cp ai-translator/api/.env.dist ai-translator/api/.env && \
cp ai-translator/esco-helper/.env.dist ai-translator/esco-helper/.env && \
cp skill-tagging/.env.dist skill-tagging/.env
# Start project
docker compose up --build -d
# Load data (users in database + framework esco/rome data,...)
make load-all
# or
./scripts/import_es.sh
docker compose exec ai-translator-api python -m fixtures.load_all
```

## Check running services
- AI Translator UI : http://localhost:8501
- AI Translator Admin : http://localhost:8501
- AI Translator API Swagger: http://localhost:8000
- AI Translator EscoHelper API Swagger : http://localhost:8080/api/v1/swagger
- AI Translator PostgreSQL : http://localhost:5432
- Elasticsearch : http://localhost:9200
- Skill Tagging API : http://localhost:8081

## Tests
```bash
make tests
# or
docker compose up --build -d
make tests-ai-translator-unit
make tests-ai-translator-api
make tests-skill-tagging-api
docker compose down -v
```

## The AI Translator

This component has : 
- an **API** : all features of the translator can be used here (crud on users, crud on rules, apply translator on data source, crud on matchings,..)
- a **Data Provider UI** : the main focus of this UI is for rules creation and suggestions validation. 
- an **Administration UI** : to manage users (data providers), you can also do a crud on users directly from the database
- a **database PostgreSQL** : store users details

Workflow :
1. Create your user => connect on the Admin UI (or directly in the database) and add a dataprovider
  - name: `MySuperDataProvider`
  - password: `changeme`
  - role: `ROLE_PROVIDER`
  - status: `active`
2. Create your translator rules => connect on the UI
    - upload a file you want to apply the translator on `browse file`
    - List objects your file has according to the Pivotal Ontology
        - Profiles
        - Experiences
            - type: `Educational`, `Professional`, `Vocational`, `Personnality test`
            - status: `Past`, `Ongoing`, `Suggested`
        - skills: you can link them to a created `Experience` if you source file has skills affected to `Experience` _(example if some past professional experience have some skills related)_
    - Map your fields to the Pivotal Ontology objects properties. You've just listed different type of objects your file has, now define which field map with Pivotal Ontology object property

3. Once you have your rules, you can either use translator on your data from the UI or the API
    - from the UI: in the AI Translator tab, select the parameters you want (target framework esco/rome), source language, target language,...
    - from the API : use the `/tansform` endpoint. You need to click on Authorize first, with your user/password authenticate. Then With the /transform endpoint, select same parameters as the UI (target framework, source and target language). The body should look like : 

```json
{
    "document": [...] // here your data
}
```

example :

```bash
curl -X 'POST' \
  'http://locahost:8000/transform?target_framework=esco&language_source=fr&language_target=en' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer yourauthorizationtoken' \
  -H 'Content-Type: application/json' \
  -d '{
  "document": [
    {
        "name": "Utilisateur 1",
        "email": "utilisateur1@example.com",
        "address": "123 Rue de la Paix, Paris, France",
        "experiences": [
            {
                "name": "Développeur Full Stack",
                "company": "TechNova Solutions",
                "description": "Conçoit et développe des applications web complètes, du front-end au back-end.",
                "start_date": "2021-03-01",
                "end_date": "2024-03-01",
                "competencies": [
                    {"name": "Communication", "description": "Capacité à transmettre efficacement des idées.", "skillLevelValue": 4, "type": "soft_skill"},
                    {"name": "Gestion du temps", "description": "Savoir organiser son temps pour respecter les délais.", "skillLevelValue": 3, "type": "soft_skill"},
                    {"name": "JavaScript", "description": "Langage de programmation pour le développement web.", "skillLevelValue": 5, "type": "hard_skill"},
                    {"name": "Node.js", "description": "Plateforme logicielle pour les applications web côté serveur.", "skillLevelValue": 4, "type": "hard_skill"},
                    {"name": "React", "description": "Bibliothèque JavaScript pour construire des interfaces utilisateur.", "skillLevelValue": 4, "type": "hard_skill"}
                ]
            }
        ]
    },
    {
        // Here another object
    },
    {
        // Here another object
    }
]

}'
```

4. you should get a json-ld response, with matching of your Skills and/or Experiences with esco/rome, in correct required language

## Skill Tagging API

### Description
This API allows the extraction of skills from a training description and enhances them through a human feedback system.
Suggestions are generated using OpenSource sementical model `paraphrase-multilingual-mpnet-base-v2` available on HugginFace and Elasticsearch (as a vectorization database, for search).

### Endpoints

#### **Extract Skills: `http://locahost:8081/skillTagging`

- **method**: `POST`  
- **description**: Analyzes a given course description and returns skill suggestions.  
- **request**:
```json
{
    "key": "my-course-unique-key",
    "title": "Project Management Specialization",
    "description": "The Project Management specialization is designed to be an introduction to the project management discipline, including the concepts, tools, and techniques used in the management and leadership of projects. Key topics covered include the role of the project manager; the project team; cost, schedule and risk management; quality in projects; and the project lifecycle.",
    "skills": [
        {"skill": "existing-skill-id"} // this is to exclude some already known skills from the Skill tagging response
    ]
}
```
- **response**:
```json
{
    "key": "my-course-unique-key",
    "skills": [
        { "referential": "ESCO", "skill": "cd5efa8c-e44d-4cbc-91c6-796018dbed68" },
        { "referential": "ESCO", "skill": "32db65d3-5ef3-43eb-9bf8-752c9cf0b22e" },
        { "referential": "ESCO", "skill": "c5a135be-218d-48e6-a422-5225a576dcd8" },
        { "referential": "ESCO", "skill": "4df7a57a-9405-4995-8e02-4ca404832247" },
        { "referential": "ESCO", "skill": "c881ddd2-9c0e-4743-bd24-36be650493dd" }
    ]
}

```
- **effect**: A "matching" document will be created in our database (Elasticsearch) with the suggested skills.  

#### Send feedback: `http://locahost:8081/feedback`
- **method**: `POST`  
- **description**: Updates the status of a suggestion based on user feedback.
- **request**:
```json
{
    "updates": [
        {
            "offerKey": "my-course-unique-key",
            "skillCode": "cd5efa8c-e44d-4cbc-91c6-796018dbed68",
            "accepted": true,
            "timestamp": 1744795537
        }
    ]
}
```
- **response**:
```json
{
    "result":"Feedback processed in 0.11s",
    "validation":[
        {"accepted":true,"offerKey":"my-course-unique-key","skillCode":"cd5efa8c-e44d-4cbc-91c6-796018dbed68","timestamp":1744795537}
    ]
}
```

- **effect**: The skill is marked as `validated` or `rejected` in Elasticsearch.

**Errors handling**
- if you try to validate a skill for a course but we didnt suggest it 
```json
{
    "error":"Suggestion for skill wrong-skill-key not found in matching document"
}
```
- if you try to validate a skill for a key course we didnt suggest any skill for
```json
{
    "error":"Document matching not found for key: wrong-key"
}
```