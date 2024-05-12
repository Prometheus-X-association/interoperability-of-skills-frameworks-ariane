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
)
from datetime import datetime
from sqlalchemy.orm import relationship
from fastapi_utils.api_model import APIModel
from typing import Any, List, Optional
from . import Base


class DataProvider(Base):

    __tablename__ = "dataprovider"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256))
    document_type = Column(String(256))

    def update(self, new_data: dict):
        for key, value in new_data.items():
            if value:
                setattr(self, key, value)


class DataProviderDTO(APIModel):
    name: str
    document_type: str
