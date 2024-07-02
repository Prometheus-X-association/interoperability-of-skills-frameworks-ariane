import hashlib
from typing import List
from term_matching_engine.graphql_helper import graphql_request_helper
import json
import os

# Helper functions
def md5(content : str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()

class TermMatchingEngine:

    def __init__(self) -> None:
        # Load the model
        self.graphql_engine = graphql_request_helper()
        cwd=os.getcwd()
        self.glq_queries = self.load_queries(f"{cwd}/term_matching_engine/gql_functions.json")

    def load_queries(self,filename):
        with open(filename, "r") as file:
            return json.load(file)

    def get_query_function(self, provider: str, feature: str):
        gql_functions = self.glq_queries[provider][feature]
        return gql_functions

    def get_gql_term_matching(self, provider: str, feature: str, query_vector: list[float]) -> dict:
        query_function = self.get_query_function(provider, feature)
        gql_variables = {"queryVector": query_vector}
        return self.graphql_engine.get_graphql_result(query_function, gql_variables)

    def delete_concept(self, concept_id):
        query = """
        mutation DeleteConcept($input: deleteConceptInput) {
            deleteConcept(input: $input) {
                id
            }
        }
        """
        
        variables = {
            "input": {
                "where": {
                    "id": concept_id
                }
            }
        }
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["deleteConcept"]

    def create_concept(self, concept_id, concept_pref_label, collection_id):
        query = """
        mutation CreateConcept($input: createConceptInput) {
            createConcept(input: $input) {
                id
                prefLabel {
                    value
                }
                memberOf {
                    id
                    prefLabel {
                        value
                    }
                }
            }
        }
        """

        variables = {
            "input": {
                "data": {
                    "id": concept_id,
                    "prefLabel": [{"value": concept_pref_label}],
                    "memberOf": collection_id
                }
            }
        }

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["createConcept"]

    def search_for_concept(self, concept_id):
        query = """
        query searchConcept($skosId: [ID]) {
            skos(id: $skosId) {
                Concept {
                    id
                    prefLabel {
                        value
                    }
                    memberOf {
                        id
                        prefLabel {
                            value
                        }
                    }
                }
            }
        }
        """

        variables = {
            "skosId": concept_id,
        }

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["skos"]["Concept"]

    def search_for_collection(self, collection_id):
        query = """
        query searchCollection($skosId: [ID]){
            skos(id: $skosId) {
                Collection {
                    id
                    prefLabel {
                        value
                    }
                    member {
                        ... on Concept {
                            id
                            prefLabel {
                                value
                            }
                        }
                    }
                }
            }
        }
        """

        variables = {
            "skosId": collection_id,  # "term:interim/polarity/scale/1"
        }

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result['skos']['Collection']

    def delete_collection(self, collection_id):
        query = """
        mutation DeleteCollection($input: deleteCollectionInput) {
            deleteCollection(input: $input) {
                id
            }
        }
        """

        variables = {
            "input": {
                "where": {
                    "id": collection_id
                }
            }
        }

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["deleteCollection"]
        
    
    
    def create_collection(self, collection_id, collection_label):
        query = """
        mutation CreateCollection($input: createCollectionInput) {
            createCollection(input: $input) {
                id
                prefLabel {
                    value
                }
            }
        }
        """

        variables = {
            "input": {
                "data": {
                    "id": collection_id,
                    "prefLabel": [
                        {
                            "value": collection_label
                        }
                    ]
                }
            }
        }

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result['createCollection']

    
    # provider_name = 'interim' / collection_pref_label = 'polarity' / collection_category = 'scale' / concept_pref_label = 'example-polarity-1' 
    def get_gql_create_or_find_term(self, provider_name: str, collection_pref_label: str, collection_category: str, concept_pref_label : str) -> dict:
        # Find or create the concept
        concept_id = f"term:{provider_name}/{collection_pref_label}/value/{md5(concept_pref_label)}"
        collection_id = f"term:{provider_name}/{collection_pref_label}/{collection_category}"
        concept = self.search_for_concept(concept_id)
        concept_exist = len(concept) >= 1
        if not concept_exist:
            collection = self.search_for_collection(collection_id)
            collection_exist = len(collection) >= 1
            if not collection_exist:
                collection_label = f"{provider_name} collection for {collection_pref_label}"
                new_collection = self.create_collection(collection_id, collection_label)
            concept = self.create_concept(concept_id, concept_pref_label, collection_id)
        return concept
    
    
    def generate(self, documents: List[dict], by_tree: bool = True) -> dict:
        instances = {}
        
        for instance in documents['graph']:
            if '__term__' in instance:
                concept_pref_label = instance["__term__"]['str_value'] # 0.8
                collection_pref_label = instance["__term__"]['scale'] #skill 
                collection_category = instance["__term__"]['collection_category']
                provider_name =  instance["__term__"]['provider'] # provider 
                concept_id = f"term:{provider_name}/{collection_pref_label}/value/{md5(concept_pref_label)}"
                collection_id = f"term:{provider_name}/{collection_pref_label}/{collection_category}"
                
                if not concept_id in instances:
                    term = self.get_gql_create_or_find_term(provider_name, collection_pref_label,collection_category, concept_pref_label)
                    instances[concept_id] = term
                    term_in_document = {}
                    term_in_document['id'] = f'term:{provider_name}/{collection_pref_label}/level/{concept_pref_label}'
                    term_in_document['notation'] = instance["__term__"]['value']
                    term_in_document['type'] = 'skos:Concept'
                    term_in_document['prefLabel'] = {}
                    term_in_document['prefLabel']['@language'] =  instance["__term__"]['language']
                    term_in_document['prefLabel']['@value'] = instance["__term__"]['str_value']
                    documents['graph'].append(term_in_document)
                instance['skillLevelValue'] = f'term:{provider_name}/{str.lower(collection_pref_label)}/{md5(instance["__term__"]["scale_path"])}/level/{concept_pref_label}'
                instance['skillLevelScale'] = f'term:{provider_name}/{str.lower(collection_pref_label)}/{md5(instance["__term__"]["scale_path"])}'
        
        for instance in documents['graph']:
            if '__term__' in instance:
                del instance["__term__"]
                
        return documents