from fastapi import FastAPI
import uvicorn
import logging
import api.routers as routers
from api.config import get_api_settings
from api import routers
import os


# Set up logging
logging.basicConfig(level=logging.INFO)
IS_TESTING = os.environ.get("API_ENVIRONMENT", "development") == "testing"
logger = logging.getLogger(__name__)


def get_app():
    get_api_settings.cache_clear()
    settings = get_api_settings()
    app = FastAPI(**settings.fastapi_kwargs)
    app.include_router(routers.ontology.router, prefix="/ontologies")
    app.include_router(routers.machine_learning.router, prefix="/machine_learning")
    app.include_router(routers.term_matching.router, prefix="/term_matchings")
    return app


app = get_app()


def start_dev():
    """Launch the app with `poetry run dev` call at root level"""
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
