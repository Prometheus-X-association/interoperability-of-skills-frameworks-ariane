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
