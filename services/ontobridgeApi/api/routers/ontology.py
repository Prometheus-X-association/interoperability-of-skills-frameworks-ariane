<<<<<<< HEAD
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
=======
from fastapi import Body
>>>>>>> ca602c0 (adding ontology service)
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from api.models.data_provider import DataProviderDTO
from fastapi.param_functions import Query
<<<<<<< HEAD
from redis import client
from sqlalchemy.future import select
from sqlalchemy import func, tuple_
from api.services.ontology_service.ontology_service_helloworld import HelloWorld_service
import json
import pickle
import datetime
import re
>>>>>>> 2abe167 (fast api)
=======

from api.services.ontology_service.ontology_service import OntologyService
from ontology_engine.rule import Rule
from ontology_engine.tools import clear_dict
<<<<<<< HEAD
>>>>>>> ca602c0 (adding ontology service)
=======
from api.services.ontology_service.ontology_service_helloworld import HelloWorld_service
>>>>>>> 7afd4f8 (launcher debug + postman)

router = InferringRouter()


@cbv(router)
class ontologies:
<<<<<<< HEAD
<<<<<<< HEAD
    def __init__(self) -> None:
        self.ontology_engine = OntologyService()
        pass

=======
>>>>>>> 2abe167 (fast api)
=======
    def __init__(self) -> None:
        self.ontology_engine = OntologyService()
        pass
<<<<<<< HEAD
    
>>>>>>> ca602c0 (adding ontology service)
=======

>>>>>>> 7afd4f8 (launcher debug + postman)
    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.get("/get_mapping_rules")
    async def get_mapping_rules(
<<<<<<< HEAD
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
<<<<<<< HEAD
                    del dict[key]
            result.append(dict)
        return result

    @router.post("/get_jsonld_from_mapping_rules")
    async def get_jsonld_from_mapping_rules(
        self,
        mapping_rules: dict = Body(..., description="the mapping rules", embed=True),
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
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
=======
        self,
        provider_name: str = Query(..., description="Name of the data provider"),
        document_type: Optional[str] = Query(None, description="the document type "),
        version: Optional[str] = Query(None, description="Version of the rules"),
<<<<<<< HEAD
>>>>>>> 260d5c9 (fast api)
    ) -> dict:  # instantiate redis_client by dependency injection
        data_provider = DataProviderDTO(name=provider_name, document_type=document_type)
        return data_provider
=======
    ) -> list[dict]:  # instantiate redis_client by dependency injection
        rules = self.ontology_engine.get_mapping_rules(name=provider_name)
        result = []
        for rule in rules:
            dict = rule.__dict__
            for key in dict.copy().keys():
                if dict[key] == '':
=======
>>>>>>> 7afd4f8 (launcher debug + postman)
                    del dict[key]
            result.append(dict)
        return result
>>>>>>> ca602c0 (adding ontology service)

    @router.post("/get_jsonld_from_mapping_rules")
    async def get_jsonld_from_mapping_rules(
        self,
        mapping_rules: dict = Body(..., description="the mapping rules", embed=True),
        document: list[dict] = Body(..., description="the document", embed=True),
=======
        document:  list[dict] | dict = Body(..., description="the document", embed=True),
>>>>>>> ff30346 (allow document to be a document or a list)
=======
        document: list[dict] | dict = Body(..., description="the document", embed=True),
>>>>>>> be49dde (update ressources with last sample)
        version: Optional[str] = Query(None),
    ) -> dict:  # instantiate redis_client by dependency injection
        if isinstance(document, dict):
            document = [document]
        rules: List[Rule] = []
        for rule in mapping_rules["graph"]:
            currentRule = Rule(**rule)
            rules.append(currentRule)
        data_provider = self.ontology_engine.generate_mapping_from_rules_provided(
            document=document, mapping_rules=rules
        )
=======
>>>>>>> 354c9de (change line length in black 88 -> 128)
        return data_provider

<<<<<<< HEAD

    @router.get("/helloworld/{name}")
    async def get_hello_world(self, name: str) -> str:
        # Using the redis_client here if needed
<<<<<<< HEAD
        return f"hello {date}"
>>>>>>> 2abe167 (fast api)
=======
        onto_service = HelloWorld_service()
        return onto_service.say_hello(name)
>>>>>>> 08c4ab0 (hello service)
=======
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
<<<<<<< HEAD
>>>>>>> ca602c0 (adding ontology service)
=======

    @router.get("/helloworld")
    async def get_hello_world(self, name: str) -> str:
        # Using the redis_client here if needed
        onto_service = HelloWorld_service()
        print("yeah")
        return onto_service.say_hello(name)
>>>>>>> 7afd4f8 (launcher debug + postman)
