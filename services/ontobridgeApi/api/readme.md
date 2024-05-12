# We explain below how to run ontobridge - API and how the APP is build

# Getting started

This app uses Fast API framework, used to dev scalable and asynchronous python APIs

- You'll need a postgres and redis : use `docker-compose up -d` to launch containers with docker (using `docker-compose.yml` file)
- You need `Poetry` to manage dependancies (`pip install poetry`)
- Run `poetry install` to install the depencies from `poetry.lock` package versions
- Once done you can start the environement run `poetry shell`, it will set and target the virtual envrironment
- In this shell :
- To start the dev server : `poetry run dev` (it will run start_dev in api.main module and launch `uvicorn` `ASGI` server`)
- `.env` contains the environement variables FYI
- `pydantic` is used as data model validation
- see API endpoints in routers directory

# migrate database

- create manually `ontobridge`postgres database (in any IHM) , see `.env` to find the params to connect to database:
  API_DB_USER='postgres'
  API_DB_PASSWORD='mypassword'
  API_DB_HOST=127.0.0.1
  API_DB_PORT=5432
  API_DB_NAME='ontobridge'
- run `alembic upgrade head` to create database schema

# to Test the endpoints

- load `http://127.0.0.1:8000/docs` to access the swagger after having the launch the App

# Database, cache

- We are using `SQL Alchemy` as ORM
- `redis` as Cache App
- `Alembic` as migration manager.
- `pydantic` is used as data model validation

- database details: the db is `ontobridge` and the table storing the ... is ..., see alembic `first_migration.py`)

BD Model are definied in the `models` directory.
To add a new Model you need to create a new file.

When you make a change or an addition to a Model class you need to run the following command to generate the associated migration : ```
alembic revision --autogenerate -m"My explicit message(Replace this)"

```

This command will create a new file in the `alembic/versions` directory. You have to check the content of this file to ensure it's valid and won't drop anything.
When this is fine you can execute this new migration using this :

```

alembic upgrade head

```

```
