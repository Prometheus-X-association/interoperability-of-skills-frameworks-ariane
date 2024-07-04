<<<<<<< HEAD
<<<<<<< HEAD
# NOT USED : allow the setup of postgres database combined with sqlalchemy ORM to store model entities
=======
>>>>>>> 2abe167 (fast api)
=======
# NOT USED : allow the setup of postgres database combined with sqlalchemy ORM to store model entities
>>>>>>> 3b02988 (refactor and update folders)
from multiprocessing.connection import Client
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, Session
from api.config import get_api_settings
import redis
from redis import client

settings = get_api_settings()


def get_database_url(driver):
    return f"{driver}://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"


engine = create_engine(get_database_url("postgresql"), pool_size=10, max_overflow=10)
SessionLocal: Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

async_engine = create_async_engine(get_database_url("postgresql+asyncpg"))
<<<<<<< HEAD
<<<<<<< HEAD
async_session: Session = sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)

redisCLient = redis.Redis(host=settings.redis_host, port=settings.redis_port, db=settings.redis_db)
=======
async_session: Session = sessionmaker(
    async_engine, expire_on_commit=False, class_=AsyncSession
)

redisCLient = redis.Redis(
    host=settings.redis_host, port=settings.redis_port, db=settings.redis_db
)
>>>>>>> 2abe167 (fast api)
=======
async_session: Session = sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)

redisCLient = redis.Redis(host=settings.redis_host, port=settings.redis_port, db=settings.redis_db)
>>>>>>> 354c9de (change line length in black 88 -> 128)

Base = declarative_base()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db() -> Session:
    db = async_session()
    try:
        yield db
    finally:
        await db.close()


def get_redis() -> client.Redis:
    db_redis = redisCLient
    try:
        yield db_redis
    finally:
        db_redis.close()
