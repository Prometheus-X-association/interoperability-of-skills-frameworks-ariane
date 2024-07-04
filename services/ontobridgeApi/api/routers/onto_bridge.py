from fastapi import Body
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from fastapi.param_functions import Query

<<<<<<< HEAD
<<<<<<< HEAD
from api.services.matching_service.source_mapping_service import SourceMappingService
from api.services.matching_service.term_matching_service import TermMatchingService
from api.services.ontology_service.ontology_service import OntologyService
=======
from api.services.machine_learning_service.maching_learning_service import SourceMappingService
from api.services.ontology_service.ontology_service import OntologyService
from api.services.term_matching_service.term_matching_service import TermMatchingService
from ontology_engine.rule import Rule
from ontology_engine.tools import clear_dict
>>>>>>> 269d0fd (add transformation)
=======
from api.services.matching_service.source_mapping_service import SourceMappingService
from api.services.matching_service.term_matching_service import TermMatchingService
from api.services.ontology_service.ontology_service import OntologyService
>>>>>>> 3b02988 (refactor and update folders)

router = InferringRouter()

term_matching_service = TermMatchingService()
ontology_engine = OntologyService()
source_mapping_service = SourceMappingService()

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3b02988 (refactor and update folders)

@cbv(router)
class onto_bridges:
=======
@cbv(router)
<<<<<<< HEAD
class onto_bridge:
>>>>>>> 269d0fd (add transformation)
=======
class onto_bridges:
>>>>>>> 4275276 (update dependencies)
    def __init__(self) -> None:
        pass

    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

<<<<<<< HEAD
    @router.post("/transform")
=======
    @router.get("/transform")
>>>>>>> 269d0fd (add transformation)
    async def transform(
        self,
        provider_name: str = Query(..., description="Name of the data provider"),
        document: list[dict] | dict = Body(..., description="the document", embed=True),
        target_framework: str = Query(..., description="Name of the target framework (rome, esco)"),
<<<<<<< HEAD
<<<<<<< HEAD
        version: Optional[str] = Query(
            None, description="Version of the rules"
        ),  # NOT USED : will allow the versionning of rules
    ) -> dict:  # instantiate redis_client by dependency injection
=======
        version: Optional[str] = Query(None, description="Version of the rules"),
=======
        version: Optional[str] = Query(
            None, description="Version of the rules"
        ),  # NOT USED : will allow the versionning of rules
>>>>>>> 3b02988 (refactor and update folders)
    ) -> list[dict]:  # instantiate redis_client by dependency injection
>>>>>>> 269d0fd (add transformation)
        if isinstance(document, dict):
            document = [document]
        data_provider = ontology_engine.generate_mapping_from_provider_rules(provider_name, document)
        serialisationWithTerm = term_matching_service.term_matching_engine.generate(data_provider)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3b02988 (refactor and update folders)
        serialisationWithTermAndMatching = source_mapping_service.source_mapping_engine.generate(
            serialisationWithTerm, target_framework
        )

<<<<<<< HEAD
=======
        serialisationWithTermAndMatching = source_mapping_service.source_mapping_engine.generate(serialisationWithTerm,target_framework)
        
>>>>>>> 269d0fd (add transformation)
=======
>>>>>>> 3b02988 (refactor and update folders)
        return serialisationWithTermAndMatching
