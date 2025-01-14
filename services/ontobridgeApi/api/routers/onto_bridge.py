from fastapi import Body
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from fastapi.param_functions import Query

from api.services.matching_service.source_mapping_service import SourceMappingService
from api.services.matching_service.term_matching_service import TermMatchingService
from api.services.ontology_service.ontology_service import OntologyService

router = InferringRouter()

term_matching_service = TermMatchingService()
ontology_engine = OntologyService()
source_mapping_service = SourceMappingService()


@cbv(router)
class onto_bridges:
    def __init__(self) -> None:
        pass

    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.post("/transform")
    async def transform(
        self,
        provider_name: str = Query(..., description="Name of the data provider"),
        document: list[dict] | dict = Body(..., description="the document", embed=True),
        target_framework: str = Query(..., description="Name of the target framework (rome, esco)"),
        version: Optional[str] = Query(
            None, description="Version of the rules"
        ),  # NOT USED : will allow the versionning of rules
    ) -> dict:  # instantiate redis_client by dependency injection
        if isinstance(document, dict):
            document = [document]
        data_provider = ontology_engine.generate_mapping_from_provider_rules(provider_name, document)
        serialisationWithTerm = term_matching_service.term_matching_engine.generate(data_provider)
        serialisationWithTermAndMatching = source_mapping_service.source_mapping_engine.generate(
            serialisationWithTerm, target_framework
        )

        return serialisationWithTermAndMatching
