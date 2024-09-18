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

    __tablename__ = "embedding_payload"

    id = Column(Integer, primary_key=True, index=True)
    sentences = Column(ARRAY(String))

    def update(self, new_data: dict):
        for key, value in new_data.items():
            if value:
                setattr(self, key, value)


class EmbeddingPayload(APIModel):
    sentences: list[str] = Field(..., example=["Bonjour, comment ça va?"], description="List of texts to embed")
