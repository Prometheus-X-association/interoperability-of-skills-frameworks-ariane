from datetime import date
from typing import List
from fastapi import Depends
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from api.models.data_provider import DataProvider, DataProviderDTO
from api.database import get_db, get_async_db, get_redis, Session, async_session
from fastapi import HTTPException
from fastapi.param_functions import Query
from redis import client
from sqlalchemy.future import select
from sqlalchemy import func, tuple_
from api.services.ontology_service.ontology_service_helloworld import HelloWorld_service
import json
import pickle
import datetime
import re

router = InferringRouter()


@cbv(router)
class ontologies:
    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.get("/get_mapping_rules")
    async def get_mapping_rules(
        self,
        document_type: str = Query(..., description="document type"),
        provider_name: str = Query(..., description="Name of the data provider"),
        version: Optional[str] = Query(None, description="Version of the rules"),
    ) -> dict:  # instantiate redis_client by dependency injection
        data_provider = DataProviderDTO(name=provider_name, document_type=document_type)
        return data_provider

    @router.post("/get_jsonld_from_mapping_rules")
    async def get_jsonld_from_mapping_rules(
        self,
        mapping_rules: dict,
        json_source: dict,
        version: Optional[str] = Query(None),
    ) -> dict:  # instantiate redis_client by dependency injection
        return {}

    @router.get("/get_jsonld_from_provider")
    async def get_jsonld_from_provider(
        self,
        document_type: str = Query(..., description="document type"),
        provider_name: str = Query(..., description="Name of the data provider"),
        version: Optional[str] = Query(None, description="Version of the rules"),
    ) -> dict:  # instantiate redis_client by dependency injection
        data_provider = DataProviderDTO(name=provider_name, document_type=document_type)
        return data_provider


    @router.get("/helloworld/{name}")
    async def get_hello_world(self, name: str) -> str:
        # Using the redis_client here if needed
        onto_service = HelloWorld_service()
        return onto_service.say_hello(name)
