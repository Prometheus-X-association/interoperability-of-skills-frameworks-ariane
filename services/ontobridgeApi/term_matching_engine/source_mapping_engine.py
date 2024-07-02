import hashlib
from typing import List

from bs4 import BeautifulSoup
from api.services.machine_learning_service.embeddings_service import EmbeddingService
from term_matching_engine.graphql_helper import graphql_request_helper
import json
import os

from term_matching_engine.term_matching_engine import TermMatchingEngine


def md5(content : str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()

class SourceMappingEngine:
    def __init__(self) -> None:
        # Load the model
        self.graphql_engine = graphql_request_helper()
        self.embeddings_service = EmbeddingService()
        self.term_matching_engine = TermMatchingEngine()
    
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
        target_language = source_language

        # compatibility with findOrCreateTerm naming
        collection_pref_label = source_type
        concept_pref_label = source_value['label']
        concept_pref_description = source_value['description']
        
        # find or create the concept
        # Search for concept
        concept_id = f"term:{provider_name}/{collection_pref_label}/{target_framework}/value/{md5(concept_pref_label)}"
        collection_id = f"term:{provider_name}/collection/{collection_pref_label}/{target_framework}"
        
        concept = self.search_for_concept_with_mappings(concept_id)
        concept = concept[0] if concept else None

        # if conceptid not exist
        if not concept:
            collection = self.search_for_collection(collection_id)
            collection_exist = len(collection) >= 1

            # if collectionid not exist
            if not collection_exist:
                collection_label = f"{provider_name} collection for {collection_pref_label} and framework {target_framework}"
                # we create the collection
                new_collection = self.create_collection(collection_id, collection_label)

            # we create the concept
            concept = self.create_concept(concept_id, concept_pref_label, source_language, collection_id)
            concept = concept[0]
        
        mappings_list = []
        # if mapping exist we return it.
        # no notion of target_framework
        if concept.get('mapping'):
            mappings_list = concept['mapping']
            return mappings_list
    
        # if not, we create it 
        if concept_pref_description == '':
            text = concept_pref_label
        else: 
            text = f'{concept_pref_label} {concept_pref_description}'
        soup = BeautifulSoup(concept_pref_label, 'html.parser')
        concept_pref_label = soup.get_text()
            
        # string len limit is 1678 
        text = concept_pref_label[:1678]
        
        search_vector = self.embeddings_service.get_vector(text)
         
        term_matching_responses = self.term_matching_engine.get_gql_term_matching(target_framework, source_type, search_vector['embeddings'])
        
        
        # TODO : how to extend it ? 
        access_values = lambda: (_ for _ in ()).throw(Exception('Please override'))
        if target_framework == 'rome' and source_type == 'job':
            access_values = lambda d: d['rome']['employment']['Position']
        
        if target_framework == 'rome' and source_type == 'skill':
            access_values = lambda d: d['rome']['skills']['Skill_rome']
            
        if target_framework == 'esco' and source_type == 'skill':
            access_values = lambda d: d['esco']['Skill']
        
        if target_framework == 'esco' and source_type == 'job':
            access_values = lambda d: d['esco']['Occupation']
        
        values = access_values(term_matching_responses)

        # build the mapping values and create them
        mappings = [{
            'id': f"term:{provider_name}/mapping/" + md5(f'{concept_id}-{v["id"]}'),
            'lang': target_language,
            'score': v['_met']['score'] if '_met' in v and 'score' in v['_met'] else 0,
            'target': v['id'],
            'validated': 0,
            'framework': target_framework,
            'source': "elastic-search",
            'mappingType': "skos:exactMatch",
        } for v in values]

        mappings_create = self.create_mappings(mappings)
        mappings_ids = [m['id'] for m in mappings_create]
        concept_update = self.update_concept_mapping(concept_id, mappings_ids)

        # we retrieve the concept just created.
        final_map = self.search_for_concept_with_mappings(concept_id)
        final_map = final_map[0]
        mappings_list = final_map['mapping']
        return mappings_list

    def generate(self, documents: List[dict], target_framework: str , by_tree: bool = True) -> dict:
        instances = {}
        for instance in documents['graph']:
            if '__matching__' in instance:
                provider_name = instance["__matching__"]['provider']
                source_value = {}
                source_value['label'] = instance["__matching__"]['sourceValue']
                source_value['description'] = instance["__matching__"]['parameter']
                source_type = instance["__matching__"]['subtype']
                source_language = instance["__matching__"]['language']
                
                target_language = source_language

                # compatibility with findOrCreateTerm naming
                collection_pref_label = source_type
                concept_pref_label = source_value['label']
                
                concept_id = f"term:{provider_name}/{collection_pref_label}/{target_framework}/value/{md5(concept_pref_label)}"
                collection_id = f"term:{provider_name}/collection/{collection_pref_label}/{target_framework}"
                
                ## to be removed 
                mappings_list = self.get_gql_create_or_find_mapping(provider_name, source_value,source_type, source_language, target_framework)

                del_map_id = [m['id'] for m in mappings_list]
                del_map = self.delete_mappings(del_map_id)
                print('Mappings deleted', del_map)
                del_concept = self.update_concept_mapping(concept_id, [])
                print('Concept.mapping property updated', del_concept)

                
                deleted = self.delete_concept(concept_id)
                print('Concept deleted:', deleted)

                deleted = self.delete_collection(collection_id)
                print('Collection deleted:', deleted)

                print('search-for-mapping-with-source process example finished')
                
                #
                
                
                if not concept_id in instances:
                    mappings_list = self.get_gql_create_or_find_mapping(provider_name, source_value,source_type, source_language, target_framework)
                    # { "id": "esco:adc6dc11-3376-xxxx", "prefLabel": { "@language": "fr", "@value": "Tri de d\u00e9chet" }, "type": "esco:Occupation" , "score" : 35},
                    instances[concept_id] = mappings_list
                    for mapping in mappings_list:
                        term_in_document = {}
                        term_in_document['id'] = mapping['id']
                        term_in_document['score'] = mapping['score'][0]
                        term_in_document['type'] = mapping['mappingType'][0]
                        term_in_document['prefLabel'] = {}
                        term_in_document['prefLabel']['@language'] =  mapping['lang'][0]
                        term_in_document['prefLabel']['@value'] = mapping['target'][0]['prefLabel'][0]['value']
                        documents['graph'].append(term_in_document)
                    instance['suggestions'] = [m['id'] for m in mappings_list]
               
        for instance in documents['graph']:
            if "__matching__" in instance:
                del instance["__matching__"]

        return documents