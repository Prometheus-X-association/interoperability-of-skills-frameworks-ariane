from typing import List
from term_matching_engine.graphql_helper import graphql_request_helper
import json
import os


def md5(content : str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()

class SourceMappingEngine:
    def __init__(self) -> None:
        # Load the model
        self.graphql_engine = graphql_request_helper()

    def update_concept_mapping(self, concept_id, mappings):
        query = """
                mutation UpdateConcept($input: updateConceptInput) {
                    updateConcept(input: $input) {
                        id
                    }
                }
                """

        variables = {"input": {"bulk": [{"id": concept_id, "mapping": mappings}]}}

        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["updateConcept"]

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

    def create_concept(self, concept_id, concept_pref_label, source_language, collection_id):
        query = """mutation CreateConcept($input: createConceptInput) {
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
                    "prefLabel": [{"value": concept_pref_label, "language": source_language}],
                    "memberOf": collection_id,
                }
            }
        }
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["createConcept"]

    def search_for_concept_with_mappings(self, concept_id):
        query = """
                query searchForConceptWithMappings($skosId: [ID], $sort: String, $query: String, $where: JSON) {
                    skos(id: $skosId) {
                        Concept {
                            id
                            prefLabel {
                                value
                                language
                            }
                            mapping(sort: $sort, query: $query, where: $where) {
                                id
                                score
                                framework
                                lang
                                source
                                validated
                                target {
                                    id
                                    prefLabel {
                                        language
                                        value
                                    }
                                }
                                mappingType
                            }
                        }
                    }
                }  
                """
        variables = {"skosId": [concept_id], "sort": "validated:desc,score:desc"}
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["skos"]["Concept"]

    def create_mappings(self, mappings):
        query = """
                mutation CreateMapping($input: createMappingInput) {
                    createMapping(input: $input) {
                        id
                        score
                    }
                }
                """
        variables = {"input": {"bulk": mappings}}
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["createMapping"]

    def delete_mappings(self, mapping_ids):
        query = """
                mutation DeleteMapping($input: deleteMappingInput) {
                    deleteMapping(input: $input) {
                        id
                    }
                }
                """
        variables = {"input": {"where": {"id": mapping_ids}}}
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["deleteMapping"]

    def validate_mapping(self, mapping_id):
        query = """
            mutation UpdateMapping($input: updateMappingInput) {
                updateMapping(input: $input) {
                    id
                    validated
                }
            }
            """
        variables = {"input": {"bulk": [{"id": mapping_id, "validated": 1}]}}
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["updateMapping"]

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
        variables = {"skosId": collection_id}
        result = self.graphql_engine.get_graphql_result(query, variables)
        return result["skos"]["Collection"]

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

    def get_gql_create_or_find_mapping(self, provider_name: str, source_value: str, source_type: str, source_language : str, target_framework : str) -> dict:
        # TODO
        return None

    def generate(self, documents: List[dict], by_tree: bool = True) -> dict:
        for instance in documents['graph']:
            if '__matching__' in instance:
                provider_name = instance["__matching__"]['provider']
                source_value = instance["__matching__"]['sourceValue']
                source_type = instance["__matching__"]['subtype']
                source_language = instance["__matching__"]['language']
                target_framework = instance["__matching__"]['framework']
                matching = self.get_gql_create_or_find_mapping(provider_name, source_value,source_type, source_language, target_framework)
                
               
        for instance in documents['graph']:
            if "__matching__" in instance:
                del instance["__matching__"]

        return documents