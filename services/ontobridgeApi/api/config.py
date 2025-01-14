# allow to load the .env file as a singleton for environment variables
from enum import auto
from functools import lru_cache
from fastapi_utils.enums import StrEnum
from fastapi_utils.api_settings import APISettings


class Environment(StrEnum):
    development = auto()
    production = auto()
    testing = auto()


class Settings(APISettings):
    environment: Environment = Environment.production
    db_host: str
    db_port: int
    db_user: str
    db_password: str
    db_name: str
    redis_host: str
    redis_port: int
    redis_password: str = None
    redis_db: int
    embedding_url: str
    graphql_url: str


@lru_cache()
def get_api_settings() -> Settings:
    """
    This function returns a cached instance of the APISettings object.
    Caching is used to prevent re-reading the environment every time the API settings are used in an endpoint.
    If you want to change an environment variable and reset the cache (e.g., during testing), this can be done
    using the `lru_cache` instance method `get_api_settings.cache_clear()`.
    """
    return Settings(_env_file=".env")
