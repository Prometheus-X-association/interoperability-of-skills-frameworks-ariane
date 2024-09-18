# OntoBridgeAPI

[OntoBridgeAPI Process](https://sequencediagram.org/)

```plantuml
@startuml
title OntoBridgeAPI Process

actor DataConsumer
actor DataProvider
entity DataSpaceConnector
participant OntoBridgeAPI
entity InternalEngine
entity MachineLearning
participant GraphQL
database ElasticSearch

DataProvider --> DataSpaceConnector: JSON+Framework Name
DataSpaceConnector->OntoBridgeAPI:JSON+Framework Name
OntoBridgeAPI-->InternalEngine:JSON
InternalEngine-->ElasticSearch:DataProvider Document
ElasticSearch-->InternalEngine:Mapping Rules
InternalEngine-->InternalEngine:Generate
InternalEngine-->OntoBridgeAPI:JSON-LD
OntoBridgeAPI-->GraphQL:JSON-LD+FrameworkName
GraphQL-->ElasticSearch:Query
ElasticSearch-->GraphQL:Result
GraphQL-->OntoBridgeAPI:JSON-LD with Matched Terms
activate OntoBridgeAPI #blue
OntoBridgeAPI-->OntoBridgeAPI:**Check if present in Cache**
OntoBridgeAPI-->MachineLearning:Unmatched Terms
MachineLearning-->OntoBridgeAPI:List of Unmatched Vectors
OntoBridgeAPI-->GraphQL:flush cache
deactivate OntoBridgeAPI

OntoBridgeAPI-->GraphQL:Unmatched Vectors
GraphQL-->OntoBridgeAPI:Nearest Match terms
OntoBridgeAPI-->OntoBridgeAPI:JSON-LD consolidation Match+MachineLearning
OntoBridgeAPI-->DataSpaceConnector:JSON-LD+Framework Name
DataSpaceConnector --> DataConsumer:JSON-LD+Framework Name
@enduml
```

## Install and run with Poetry

We use [Poetry](https://python-poetry.org/) 1.1.11 to manage dependencies and packaging.
If you've never used poetry, install it with **(For Powershell users, you can check the poetry installation instructions [here](https://python-poetry.org/docs/))**:

```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_VERSION=1.1.11 python -
```

If you had installed poetry before, please ensure you have the correct poetry version (1.1.11) installed in your environment:
```bash
poetry self update 1.1.11 # If `poetry --version` is not 1.1.11
```

Move to `ontobridgeApi` directory
```bash
cd .\services\ontobridgeApi
```

Enable poetry to install the venv at the root of your project dir
```bash
poetry config virtualenvs.in-project true
```

You also need poetry to use your ~3.11 python version. You can check which python poetry is using `poetry env info`.
And if you don't see the right python version please run
```bash
poetry env use /path/to/Python311/python.exe
```

Install your python environment dependencies by running:
```bash
poetry install
```