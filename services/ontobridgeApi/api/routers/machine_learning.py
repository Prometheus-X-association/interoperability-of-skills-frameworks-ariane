from fastapi import Body
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from api.models.embedding_payload import EmbeddingPayload
from fastapi.param_functions import Query

from api.services.ontology_service.ontology_service import OntologyService
from api.services.machine_learning_engine.embeddings_service import EmbeddingService

router = InferringRouter()


@cbv(router)
class embeddings:
    def __init__(self) -> None:
        self.ontology_engine = OntologyService()
        pass

    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.post("/get_embedding_vectors_from_sentences")
    async def get_embedding_vector_from_sentences(
        self,
        embedding: EmbeddingPayload = Body(..., description="the text to transform", embed=True),
    ) -> dict:  # instantiate redis_client by dependency injection
        service = EmbeddingService()
        result = service.get_vector(embedding.sentences)
        return result

    @router.post("/get_knn_from_elasticsearch_for_embedding")
    async def get_knn_from_elasticsearch_for_embedding(
        self,
        embedding: EmbeddingPayload = Body(..., description="the text to match", embed=True),
    ) -> dict:  # instantiate redis_client by dependency injection
        service = EmbeddingService()
        embedding_vector = service.get_vector(embedding.sentences)
        # knn match=graphql(embedding_vector)
        return "knn match"

    @router.post("/get_knn_from_elasticsearch_for_vector")
    async def get_knn_from_elasticsearch_for_vector(
        self,
        embedding_vector: dict = Body(..., description="the vector to match", embed=True),
    ) -> dict:  # instantiate redis_client by dependency injection
        # knn match=graphql(embedding_vector)
        return "knn match"
