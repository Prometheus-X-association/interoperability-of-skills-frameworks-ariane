import hashlib
from typing import List

import json
import os

from api.engines.term_matching_engine.graphql_helper import graphql_request_helper


# Helper functions
def md5(content: str) -> str:
    return hashlib.md5(content.encode("utf-8")).hexdigest()


class TermMatchingEngine:

    def __init__(self) -> None:
        # Load the model
        self.graphql_engine = graphql_request_helper()
        cwd=os.getcwd()
        self.glq_queries = self.load_queries()
        a=2
        #self.glq_queries = self.load_queries_from_json(f"{cwd}/term_matching_engine/gql_functions.json")

    def load_queries_from_json(self,filename):
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

        variables = {"input": {"where": {"id": concept_id}}}
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
            "input": {"data": {"id": concept_id, "prefLabel": [{"value": concept_pref_label}], "memberOf": collection_id}}
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
        return result["skos"]["Collection"]

    def delete_collection(self, collection_id):
        query = """
        mutation DeleteCollection($input: deleteCollectionInput) {
            deleteCollection(input: $input) {
                id
            }
        }
        """

        variables = {"input": {"where": {"id": collection_id}}}

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

        variables = {"input": {"data": {"id": collection_id, "prefLabel": [{"value": collection_label}]}}}

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["createCollection"]

    # provider_name = 'interim' / collection_pref_label = 'polarity' / collection_category = 'scale' / concept_pref_label = 'example-polarity-1'
    def get_gql_create_or_find_term(
        self,
        provider_name: str,
        concept_id: str,
        collection_id: str,
        concept_pref_label: str,
        collection_pref_label: str,
        path: str,
    ) -> dict:
        # Find or create the concept

        concept = self.search_for_concept(concept_id)
        concept_exist = len(concept) >= 1
        if not concept_exist:
            collection = self.search_for_collection(collection_id)
            collection_exist = len(collection) >= 1
            if not collection_exist:
                collection_label = f"{provider_name} collection for {collection_pref_label} in {path}"
                new_collection = self.create_collection(collection_id, collection_label)
            concept = self.create_concept(concept_id, concept_pref_label, collection_id)
        return concept

    def generate(self, documents: List[dict], by_tree: bool = True) -> dict:
        instances = {}

        for instance in documents["graph"]:
            if "__term__" in instance:
                concept_pref_label = instance["__term__"]["str_value"]  # 0.8
                collection_pref_label = instance["__term__"]["scale"]  # skill
                collection_category = instance["__term__"]["collection_category"]
                provider_name = instance["__term__"]["provider"]  # provider

                skill_level_value = f'term:{provider_name}/{str.lower(collection_pref_label)}/{md5(instance["__term__"]["scale_path"])}/level/{concept_pref_label}'
                skill_level_scale = (
                    f'term:{provider_name}/{str.lower(collection_pref_label)}/{md5(instance["__term__"]["scale_path"])}'
                )
                concept_id = skill_level_value
                collection_id = skill_level_scale

                if not concept_id in instances:
                    term = self.get_gql_create_or_find_term(
                        provider_name,
                        concept_id,
                        collection_id,
                        concept_pref_label,
                        collection_category,
                        instance["__term__"]["scale_path"],
                    )
                    instances[concept_id] = term
                    term_in_document = {}
                    term_in_document["id"] = skill_level_value
                    term_in_document["memberOf"] = skill_level_scale
                    term_in_document["notation"] = instance["__term__"]["value"]
                    term_in_document["type"] = "skos:Concept"
                    term_in_document["prefLabel"] = {}
                    term_in_document["prefLabel"]["@language"] = instance["__term__"]["language"]
                    term_in_document["prefLabel"]["@value"] = instance["__term__"]["str_value"]
                    documents["graph"].append(term_in_document)
                instance["skillLevelValue"] = skill_level_value
                instance["skillLevelScale"] = skill_level_scale

        for instance in documents["graph"]:
            if "__term__" in instance:
                del instance["__term__"]
                
        return documents
    

         
    def load_queries(self):
        
        query_strings = {
        "rome": {
            "job": """
            query VECRomeJob($queryVector: [Float]) {
            rome(queryVector: $queryVector) {
                employment {
                Position {
                    id
                    type
                    prefLabel {
                    value
                    }
                }
                }
            }
            }
            """,
            "skill": """
            query VECRomeSkill($queryVector: [Float]) {
            rome {
                skills(queryVector: $queryVector) {
                Skill_rome {
                    id
                    type
                    prefLabel {
                    value
                    }
                    _met {
                    score
                    }
                }
                }
            }
            }
            """
        },
        "esco": {
            "job": """
            query VECEscoJob($queryVector: [Float]) {
            esco(queryVector: $queryVector) {
                Occupation {
                id
                type
                prefLabel {
                    value
                }
                }
            }
            }
            """,
            "skill": """
            query VECEscoSkill($queryVector: [Float]) {
            esco(queryVector: $queryVector) {
                Skill {
                id
                type
                prefLabel {
                    value
                }
                }
            }
            }
            """
        }
        }
        return query_strings

