from fastapi import Body, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from api.models.data_provider import *
from api.models.term_matching_payload import TermMatchingPayload
from fastapi.param_functions import Query
<<<<<<< HEAD
<<<<<<< HEAD
from api.services.matching_service.term_matching_service import TermMatchingService
=======
from api.services.term_matching_service.term_matching_service import TermMatchingService
>>>>>>> 81c1026 (term matching service)
=======
from api.services.matching_service.term_matching_service import TermMatchingService
>>>>>>> 3b02988 (refactor and update folders)

router = InferringRouter()
term_matching_service = TermMatchingService()


@cbv(router)
class term_matchings:
    def __init__(self) -> None:
        pass

    """
    session: Session = Depends(get_db)
    async_session: Session = Depends(get_async_db)
    redis_client:client.Redis= Depends(get_redis)
    """

    @router.post("/get_term_matching_from_gql")
    async def get_term_matching_from_gql(
        self,
        term_matching: TermMatchingPayload = Body(..., description="gql payload to match", embed=True),
<<<<<<< HEAD
<<<<<<< HEAD
    ) -> dict:  # instantiate redis_client by dependency injection
=======
) -> dict :  # instantiate redis_client by dependency injection
>>>>>>> 81c1026 (term matching service)
=======
    ) -> dict:  # instantiate redis_client by dependency injection
>>>>>>> 3b02988 (refactor and update folders)
        term_matched = term_matching_service.get_gql_term_matching(
            term_matching.provider_input, term_matching.feature_input, term_matching.embedding_input
        )

        return term_matched
