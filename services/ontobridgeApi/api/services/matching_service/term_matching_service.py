import requests
from dotenv import load_dotenv
from api.config import get_api_settings
import redis
from redis import client
from api.engines.matching_engine.term_matching_engine import TermMatchingEngine


class TermMatchingService:

    def __init__(self) -> None:
        self.term_matching_engine = TermMatchingEngine()

    def get_gql_term_matching(self, provider: str, feature: str, variable: list[float]) -> dict:
        return self.term_matching_engine.get_gql_term_matching(provider, feature, variable)
