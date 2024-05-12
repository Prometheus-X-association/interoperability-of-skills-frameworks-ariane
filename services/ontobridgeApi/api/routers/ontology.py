<<<<<<< HEAD
from fastapi import Body
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.engines.ontology_engine.rule import Rule
from api.models.data_provider import *
from api.models.data_provider import DataProviderDTO
from fastapi.param_functions import Query

from api.services.ontology_service.ontology_service import OntologyService
=======
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
import os
import json
import pickle
import datetime
import re
>>>>>>> 2abe167 (fast api)

router = InferringRouter()


@cbv(router)
class ontologies:
<<<<<<< HEAD
    def __init__(self) -> None:
        self.ontology_engine = OntologyService()
        pass

=======
>>>>>>> 2abe167 (fast api)
    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.get("/get_mapping_rules")
    async def get_mapping_rules(
<<<<<<< HEAD
        self,
        provider_name: str = Query(..., description="Name of the data provider"),
        document_type: Optional[str] = Query(None, description="the document type "),
        version: Optional[str] = Query(None, description="Version of the rules"),
    ) -> list[dict]:  # instantiate redis_client by dependency injection
        rules = self.ontology_engine.get_mapping_rules(name=provider_name)
        result = []
        for rule in rules:
            dict = rule.__dict__
            for key in dict.copy().keys():
                if dict[key] == "":
                    del dict[key]
            result.append(dict)
        return result

    @router.post("/get_jsonld_from_mapping_rules")
    async def get_jsonld_from_mapping_rules(
        self,
        mapping_rules: dict = Body(..., description="the mapping rules", embed=True),
        document: list[dict] | dict = Body(..., description="the document", embed=True),
        version: Optional[str] = Query(None),
    ) -> dict:  # instantiate redis_client by dependency injection
        if isinstance(document, dict):
            document = [document]
        rules: List[Rule] = []
        for rule in mapping_rules["graph"]:
            currentRule = Rule(**rule)
            rules.append(currentRule)
        data_provider = self.ontology_engine.generate_mapping_from_rules_provided(document=document, mapping_rules=rules)
        return data_provider

    @router.post("/get_jsonld_from_provider")
    async def get_jsonld_from_provider(
        self,
        provider_name: str = Query(..., description="Name of the data provider"),
        document: list[dict] | dict = Body(..., description="the document", embed=True),
        version: Optional[str] = Query(None, description="Version of the rules"),
    ) -> dict:  # instantiate redis_client by dependency injection
        if isinstance(document, dict):
            document = [document]

        data_provider = self.ontology_engine.generate_mapping_from_provider_rules(provider_name, document)
        return data_provider

    @router.get("/helloworld")
    async def get_hello_world(self, name: str) -> str:
        # Using the redis_client here if needed
        onto_service = HelloWorld_service()
        print("yeah")
        return onto_service.say_hello(name)
=======
        data_provider: DataProviderDTO, version: Optional[str] = Query(None)
    ) -> dict:  # instantiate redis_client by dependency injection
        return {}

    @router.post("/get_jsonld_from_mapping_rules")
    async def get_jsonld_from_mapping_rules(
        mapping_rules: str, data_source: dict, version: Optional[str] = Query(None)
    ) -> dict:  # instantiate redis_client by dependency injection
        return {}

    @router.get("/get_jsonld_from_provider")
    async def get_jsonld_from_provider(
        data_provider: DataProviderDTO, version: Optional[str] = Query(None)
    ) -> dict:  # instantiate redis_client by dependency injection
        return {}

    @router.get("/helloworld/{date}")
    async def get_hello_world(self, date: str) -> str:
        # Using the redis_client here if needed
        return f"hello {date}"
>>>>>>> 2abe167 (fast api)
