from sqlite3 import Date
from tokenize import Double
from unicodedata import numeric
from sqlalchemy import (
    Boolean,
    Column,
    Numeric,
    ForeignKey,
    Integer,
    String,
    Enum,
    DateTime,
    ARRAY,
)
from datetime import datetime
from sqlalchemy.orm import relationship
from fastapi_utils.api_model import APIModel
from pydantic import Field
from typing import Any, List, Optional
from . import Base


class DataProvider(Base):

    __tablename__ = "term_matching_payload"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String)
    feature = Column(String)
    embedding_vector = Column(ARRAY(float))

    def update(self, new_data: dict):
        for key, value in new_data.items():
            if value:
                setattr(self, key, value)


class TermMatchingPayload(APIModel):
    provider_input: str = Field(..., example="rome", description="provider")
    feature_input: str = Field(..., example="job", description="feature")
    embedding_input: list[float] = Field(..., example=[6454654646], description="embedding vector")
