import hashlib
from term_matching_engine.source_mapping_engine import SourceMapping
from term_matching_engine.term_matching_engine import TermMatching

def md5(content : str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def test_engine_mapping_for_source():
    source_mapping_engine = SourceMapping()
    provider_name = 'orientoi_1'
    source_value = {
        'label': 'Agent / Agente de centre de tri de dechet',
        'description': "<h3>Définition</h3><p>Réalise des opérations de tri de déchets et produits industriels en fin de vie (textiles, plastiques, verres, composants, ...) selon les règles de sécurité, d'environnement et les impératifs de récupération (qualité, cadence, ...).<br>Peut reconditionner des produits industriels pour valorisation par réutilisation ou recyclage.<br>Peut coordonner une équipe.</p><h3>Accès au métier</h3><p>Cet emploi/métier est accessible sans diplôme ni expérience professionnelle.<br>Un ou plusieurs Certificat(s) d'Aptitude à la Conduite En Sécurité -CACES- conditionné(s) par une aptitude médicale à renouveler périodiquement peu(ven)t être requis.<br>Des vaccinations spécifiques (leptospirose, hépatite, ...) peuvent être requises selon le secteur d'activité.</p><h3>Condition du métier</h3><p>L'activité de cet emploi/métier s'exerce au sein de sociétés de services, d'associations, de collectivités territoriales, d'entreprises industrielles en contact avec différents intervenants (particuliers, conducteurs d'engins, ...).<br>Elle varie selon le lieu d'intervention et le type de produits collectés.<br>Elle peut impliquer le port de charges.<br>Le port d'équipements de protection (gants, combinaison, ...) peut être requis.</p><h3>Environnement de travail</h3><p>Structures</p><ul><li>Association</li><li>Centre Véhicules hors d'usage - VHU</li><li>Collectivité territoriale</li><li>Déchetterie</li><li>Entreprise industrielle</li><li>Ressourcerie</li><li>Société de collecte et de traitement des déchets</li><li>Société de services</li></ul><p>Secteurs</p><ul><li>Recyclage</li></ul><h3>Compétences de Base attendues</h3><table><tbody><tr><td>Réaliste</td><td>100.0 %</td></tr></tbody></table>"
    }
    source_type = 'job'
    source_language = 'fr'
    target_framework = 'rome'
    target_language = source_language

    # compatibility with findOrCreateTerm naming
    collection_pref_label = source_type
    concept_pref_label = source_value['label']
    
    # find or create the concept
    # Search for concept
    concept_id = f"term:{provider_name}/{collection_pref_label}/value/{md5(concept_pref_label)}"
    collection_id = f"term:{provider_name}/collection/{collection_pref_label}"
    
    concept = source_mapping_engine.search_for_concept_with_mappings(concept_id)
    concept = concept[0] if concept else None

    if not concept:
        print('This concept do not exist.')

        print('a) Check if the parent collection exist')
        collection = source_mapping_engine.search_for_collection(collection_id)
        collection_exist = len(collection) >= 1

        if not collection_exist:
            print('The collection do not exist, create it')
            collection_label = f"{provider_name} collection for {collection_pref_label}"
            new_collection = source_mapping_engine.create_collection(collection_id, collection_label)
            print('Collection created: \n', new_collection)
        else:
            print('Collection exist')

        print('b) Create the concept linked to the collection')
        concept = source_mapping_engine.create_concept(concept_id, concept_pref_label, source_language, collection_id)
        concept = concept[0]

    print('Concept exists. Search for mappings or create them', concept['id'], 'mapping size', len(concept.get('mapping', [])))
    mappings_list = []
    if concept.get('mapping'):
        print('==> Search for existings and validated mappings')

        mappings_list = concept['mapping']
        print(f"The concept {concept['prefLabel'][0]['value']} ({concept['id']}) has mappings:")
    else:
        # stub calculation
        search_vector = "vectStub"
        query = ""
        access_values = lambda: (_ for _ in ()).throw(Exception('Please override'))
        if target_framework == 'rome' and source_type == 'job':
            with open('graphql-vector-queries/vecRomeJob.gql', 'r') as file:
                query = file.read()
            access_values = lambda d: d['rome']['employment']['Position']
        else:
            raise Exception('These other cases need to be implemented')

        # search for matching 
        variables = {"queryVector": search_vector}
        data = request("endpoint", query, variables)
        values = access_values(data)

        # build the mapping values and create them
        mappings = [{
            'id': f"term:{provider_name}/mapping/{md5(f'{concept_id}-{v['id']}')}",
            'lang': target_language,
            'score': v['_met']['score'] if '_met' in v and 'score' in v['_met'] else 0,
            'target': v['id'],
            'validated': 0,
            'framework': target_framework,
            'source': "elastic-search",
            'mappingType': "skos:exactMatch",
        } for v in values]

        mappings_create = source_mapping_engine.create_mappings(mappings)
        mappings_ids = [m['id'] for m in mappings_create]
        concept_update = source_mapping_engine.update_concept_mapping(concept_id, mappings_ids)

        print('Search for the resulting concept with mappings:')
        final_map = source_mapping_engine.search_for_concept_with_mappings(concept_id)
        final_map = final_map[0]
        mappings_list = final_map['mapping']

        collection_category = 'scale'

        infos = [{'validated': m['validated'][0], 'score': m['score'][0], 'prefLabel': m['target'][0].get('prefLabel', [{}])[0].get('value')} for m in mappings_list]
        del_map_id = [m['id'] for m in mappings_list]
        del_map = source_mapping_engine.delete_mappings(del_map_id)
        print('Mappings deleted', del_map)
        del_concept = source_mapping_engine.update_concept_mapping(concept_id, [])
        print('Concept.mapping property updated', del_concept)

        
        deleted = source_mapping_engine.delete_concept(concept_id)
        print('Concept deleted:', deleted)

        deleted = source_mapping_engine.delete_collection(collection_id)
        print('Collection deleted:', deleted)

        print('search-for-mapping-with-source process example finished')
    
def test_engine_matching_create_or_find_term():
    term_matching_engine = TermMatching()
    provider_name = 'interim'
    collection_pref_label = 'polarity'
    collection_category = 'scale'
    concept_pref_label = 'example-polarity-1' 
    concept = term_matching_engine.get_gql_create_or_find_term(provider_name, collection_pref_label, collection_category, concept_pref_label)
    assert len(concept) >= 1
    print(concept)