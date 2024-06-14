import hashlib
from term_matching_engine.term_matching_engine import TermMatching

def md5(content : str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def test_engine_matching_for_term():
    term_matching_engine = TermMatching()
    provider_name = 'interim'
    collection_pref_label = 'polarity'
    collection_category = 'scale'
    concept_pref_label = 'example-polarity-1' 
    
    # Find or create the concept
    concept_id = f"term:{provider_name}/{collection_pref_label}/value/{md5(concept_pref_label)}"
    collection_id = f"term:{provider_name}/{collection_pref_label}/{collection_category}"
    concept = term_matching_engine.search_for_concept(concept_id)
    print(concept)
    
    concept_exist = len(concept) >= 1
    if not concept_exist:
        print('This concept does not exist.')

        print('a) Check if the parent collection exists')
        collection = term_matching_engine.search_for_collection(collection_id)
        collection_exist = len(collection) >= 1

        if not collection_exist:
            print('The collection does not exist, create it')
            collection_label = f"{provider_name} collection for {collection_pref_label}"
            new_collection = term_matching_engine.create_collection(collection_id, collection_label)
            print('   Collection created: \n', new_collection)
        else:
            print('Collection exists')

        print('b) Create the concept linked to the collection')
        concept = term_matching_engine.create_concept(concept_id, concept_pref_label, collection_id)
    else:
        print('Concept exists')

    print('The concept value is:')
    print(concept)

    deleted = term_matching_engine.delete_collection(collection_id)
    print('Concept deleted:', deleted)
    
    print('Collection deleted:', deleted)
    deleted = term_matching_engine.delete_concept(concept_id)

    print('find-or-create process example finished')
    
def test_engine_matching_create_or_find_term():
    term_matching_engine = TermMatching()
    provider_name = 'interim'
    collection_pref_label = 'polarity'
    collection_category = 'scale'
    concept_pref_label = 'example-polarity-1' 
    concept = term_matching_engine.get_gql_create_or_find_term(provider_name, collection_pref_label, collection_category, concept_pref_label)
    assert len(concept) >= 1
    print(concept)
    
    
def test_engine_matching_create_or_find_term_PITANGOO():
    term_matching_engine = TermMatching()
    provider_name = 'PITANGOO'
    collection_pref_label = 'skill'
    collection_category = 'scale'
    concept_pref_label = '0.8' 
    concept = term_matching_engine.get_gql_create_or_find_term(provider_name, collection_pref_label, collection_category, concept_pref_label)
    assert len(concept) >= 1
    print(concept)
    
    term_matching_engine = TermMatching()
    provider_name = 'PITANGOO'
    collection_pref_label = 'skill'
    collection_category = 'scale'
    concept_pref_label = '0.6' 
    concept = term_matching_engine.get_gql_create_or_find_term(provider_name, collection_pref_label, collection_category, concept_pref_label)
    assert len(concept) >= 1
    print(concept)