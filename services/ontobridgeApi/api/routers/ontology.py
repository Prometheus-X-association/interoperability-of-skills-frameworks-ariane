from fastapi import Body
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from api.models.data_provider import DataProviderDTO
from fastapi.param_functions import Query

from api.services.ontology_service.ontology_service import OntologyService
from ontology_engine.rule import Rule
from ontology_engine.tools import clear_dict

router = InferringRouter()


@cbv(router)
class ontologies:
    def __init__(self) -> None:
        self.ontology_engine = OntologyService()
        pass
    
    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.get("/get_mapping_rules")
    async def get_mapping_rules(
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
                if dict[key] == '':
                    del dict[key]
            result.append(dict)
        return result

    @router.post("/get_jsonld_from_mapping_rules")
    async def get_jsonld_from_mapping_rules(
        self,
        mapping_rules: dict = Body(..., description="the mapping rules", embed=True),
        document: list[dict]= Body(..., description="the document", embed=True), 
        version: Optional[str] = Query(None),
    ) -> dict:  # instantiate redis_client by dependency injection
        rules : List[Rule] = []
        for rule in mapping_rules['graph']:
            currentRule = Rule(**rule)
            rules.append(currentRule)
        data_provider = self.ontology_engine.generate_mapping_from_rules_provided(document=document,mapping_rules=rules)
        return data_provider

    @router.post("/get_jsonld_from_provider")
    async def get_jsonld_from_provider(
        self,
        provider_name: str = Query(..., description="Name of the data provider"),
        document_type: list[dict] = Body(..., description="the document", embed=True), 
        version: Optional[str] = Query(None, description="Version of the rules"),
    ) -> dict:  # instantiate redis_client by dependency injection
        data_provider = self.ontology_engine.generate_mapping_from_provider_rules(provider_name,document_type)
        return data_provider


    @router.get("/helloworld/{name}")
    async def get_hello_world(self, name: str) -> str:
        # Using the redis_client here if needed
        onto_service = HelloWorld_service()
        return onto_service.say_hello(name)
