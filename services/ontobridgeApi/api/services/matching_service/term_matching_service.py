import requests
from dotenv import load_dotenv
from api.config import get_api_settings
import redis
from redis import client
<<<<<<< HEAD
<<<<<<< HEAD
from api.engines.matching_engine.term_matching_engine import TermMatchingEngine
=======
from api.engines.term_matching_engine.term_matching_engine import TermMatchingEngine
>>>>>>> 3b02988 (refactor and update folders)
=======
from api.engines.matching_engine.term_matching_engine import TermMatchingEngine
>>>>>>> 5a091b3 (fix matching_engine folder name)


class TermMatchingService:

    def __init__(self) -> None:
        self.term_matching_engine = TermMatchingEngine()

    def get_gql_term_matching(self, provider: str, feature: str, variable: list[float]) -> dict:
        return self.term_matching_engine.get_gql_term_matching(provider, feature, variable)
