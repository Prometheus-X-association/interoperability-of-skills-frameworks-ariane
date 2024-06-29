import requests
from dotenv import load_dotenv
from api.config import get_api_settings
import redis
from redis import client
from term_matching_engine.term_matching_engine import TermMatchingEngine


class TermMatchingService:

    def __init__(self) -> None:
        self.term_matching_engine = TermMatchingEngine()

    def get_gql_term_matching(self, provider: str, feature: str, variable: list[float]) -> dict:
        return self.term_matching_engine.get_gql_term_matching(provider, feature, variable)
    
    def get_gql_term_create_or_find(self, rdf):
        for instance in rdf['graph']:
            if '__term__' in instance:
                concept_pref_label = instance["__term__"]['value'] # 0.8
                collection_pref_label = instance["__term__"]['scale'] #skill 
                collection_category = instance["__term__"]['collection_category'] #
                provider_name =  instance["__term__"]['provider'] # provider 
                concept = self.term_matching_engine.get_gql_create_or_find_term(provider_name, collection_pref_label,collection_category, concept_pref_label)
        return rdf
         