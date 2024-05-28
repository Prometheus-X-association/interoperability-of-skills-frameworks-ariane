<<<<<<< HEAD
from fastapi import Body, HTTPException
=======
from fastapi import Body
>>>>>>> 8044f9d (embedding endpoint)
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from api.models.embedding_payload import EmbeddingPayload
from fastapi.param_functions import Query
<<<<<<< HEAD
from api.services.machine_learning_service.embedding_service import EmbeddingService

router = InferringRouter()
embeddings_service = EmbeddingService()
=======

from api.services.ontology_service.ontology_service import OntologyService
from api.services.machine_learning_engine.embeddings_service import EmbeddingService

router = InferringRouter()
>>>>>>> 8044f9d (embedding endpoint)


@cbv(router)
class embeddings:
    def __init__(self) -> None:
<<<<<<< HEAD
=======
        self.ontology_engine = OntologyService()
>>>>>>> 8044f9d (embedding endpoint)
        pass

    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

<<<<<<< HEAD
    @router.post("/get_embedding_vectors_from_sentences_from_flask")
    async def get_embedding_vector_from_sentences_from_flask(
        self,
        embedding: EmbeddingPayload = Body(..., description="the text to transform", embed=True),
    ) -> dict:  # instantiate redis_client by dependency injection
        result = embeddings_service.get_vector_from_flask(embedding.sentences)
        return result

    @router.post("/get_embedding_vectors_from_sentences")
    async def get_embedding_vector_from_sentences(
        self,
        embedding: EmbeddingPayload = Body(..., description="the text to transform", embed=True),
    ) -> dict:  # instantiate redis_client by dependency injection
        # Check if the request was successful
        try:
            result = embeddings_service.get_vector(embedding.sentences)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
=======
    @router.post("/get_embedding_vectors_from_sentences")
    async def get_embedding_vector_from_sentences(
        self,
        embedding: EmbeddingPayload = Body(
            ..., description="the text to transform", embed=True
        ),
    ) -> dict:  # instantiate redis_client by dependency injection
        service = EmbeddingService()
        result = service.get_vector(embedding.sentences)
        return result
>>>>>>> 8044f9d (embedding endpoint)

    @router.post("/get_knn_from_elasticsearch_for_embedding")
    async def get_knn_from_elasticsearch_for_embedding(
        self,
<<<<<<< HEAD
        embedding: EmbeddingPayload = Body(..., description="the text to match", embed=True),
    ) -> dict:  # instantiate redis_client by dependency injection
        embedding_vector = embeddings_service.get_vector_from_flask(embedding.sentences)
=======
        embedding: EmbeddingPayload = Body(
            ..., description="the text to match", embed=True
        ),
    ) -> dict:  # instantiate redis_client by dependency injection
        service = EmbeddingService()
        embedding_vector = service.get_vector(embedding.sentences)
>>>>>>> 8044f9d (embedding endpoint)
        # knn match=graphql(embedding_vector)
        return "knn match"

    @router.post("/get_knn_from_elasticsearch_for_vector")
    async def get_knn_from_elasticsearch_for_vector(
        self,
<<<<<<< HEAD
        embedding_vector: dict = Body(..., description="the vector to match", embed=True),
=======
        embedding_vector: dict = Body(
            ..., description="the vector to match", embed=True
        ),
>>>>>>> 8044f9d (embedding endpoint)
    ) -> dict:  # instantiate redis_client by dependency injection
        # knn match=graphql(embedding_vector)
        return "knn match"
