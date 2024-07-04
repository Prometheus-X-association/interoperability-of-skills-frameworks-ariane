import hashlib

from bs4 import BeautifulSoup

from api.engines.matching_engine.source_mapping_engine import SourceMappingEngine
from api.engines.matching_engine.term_matching_engine import TermMatchingEngine
from api.services.machine_learning_service.embedding_service import EmbeddingService


def md5(content: str) -> str:
    return hashlib.md5(content.encode("utf-8")).hexdigest()


def test_mapping_for_source():

    # /** Algorithm description
    # calculate concept id, search if exist
    # a) if not exist
    # - did the collection exist ? if yes proceed. if not create it
    # - create the entity and assign it to variable
    # b) if exist

    # I) if have matchings for the target Framework
    #     - have one validated ? if yes return it, else return all
    # II) if don't have matchings :
    #     - calculate the vector
    #     - run the search
    #     - create the mappings from the search
    #     - add the mappings to the concept

    source_mapping_engine = SourceMappingEngine()
    embeddings_service = EmbeddingService()
    term_matching_service = TermMatchingEngine()

    provider_name = "orientoi_1"
    source_value = {
        "label": "Agent / Agente de centre de tri de dechet",
        "description": "<h3>Définition</h3><p>Réalise des opérations de tri de déchets et produits industriels en fin de vie (textiles, plastiques, verres, composants, ...) selon les règles de sécurité, d'environnement et les impératifs de récupération (qualité, cadence, ...).<br>Peut reconditionner des produits industriels pour valorisation par réutilisation ou recyclage.<br>Peut coordonner une équipe.</p><h3>Accès au métier</h3><p>Cet emploi/métier est accessible sans diplôme ni expérience professionnelle.<br>Un ou plusieurs Certificat(s) d'Aptitude à la Conduite En Sécurité -CACES- conditionné(s) par une aptitude médicale à renouveler périodiquement peu(ven)t être requis.<br>Des vaccinations spécifiques (leptospirose, hépatite, ...) peuvent être requises selon le secteur d'activité.</p><h3>Condition du métier</h3><p>L'activité de cet emploi/métier s'exerce au sein de sociétés de services, d'associations, de collectivités territoriales, d'entreprises industrielles en contact avec différents intervenants (particuliers, conducteurs d'engins, ...).<br>Elle varie selon le lieu d'intervention et le type de produits collectés.<br>Elle peut impliquer le port de charges.<br>Le port d'équipements de protection (gants, combinaison, ...) peut être requis.</p><h3>Environnement de travail</h3><p>Structures</p><ul><li>Association</li><li>Centre Véhicules hors d'usage - VHU</li><li>Collectivité territoriale</li><li>Déchetterie</li><li>Entreprise industrielle</li><li>Ressourcerie</li><li>Société de collecte et de traitement des déchets</li><li>Société de services</li></ul><p>Secteurs</p><ul><li>Recyclage</li></ul><h3>Compétences de Base attendues</h3><table><tbody><tr><td>Réaliste</td><td>100.0 %</td></tr></tbody></table>",
    }

    source_value = {
        "label": "Agent / Agente de centre de tri de dechet",
        "description": "<h3>Travailler dans LE SOCIAL</h3><p>Ce secteur est fondé sur l’humain et au service de la communauté.</p><p><img src=\"{{url}}/{{path}}/intro46.png\"></p><p>Les professionnels de ce domaine écoutent, accompagnent, aident et conseillent par leurs actions matérielles, pédagogiques et psychologiques des personnes dépendantes, des enfants, des personnes fragiles ou en difficulté : personnes âgées, handicapés, jeunes enfants, adolescents... Ils interviennent à travers l'action éducative, l'animation socioculturelle, le conseil... Ce secteur intègre également les métiers administratifs du secteur.</p><p>Les missions et publics sont variés. Les travailleurs sociaux permettent à une personne âgée dépendante de continuer à vivre chez elle en lui rendant des services chaque jour. Ils aident un enfant en situation de handicap moteur à suivre une scolarité normale en le secondant dans ses gestes d'écolier. Ils informent une famille en situation de précarité sur les aides auxquelles elle peut prétendre.</p><p><u><b>Quelques métiers du secteur :</b></u></p><p><u>L’aide sociale</u></p><p><ul><li>Assistant / Assistante sociale</li><li>Conseiller / Conseillère en insertion sociale et professionnelle</li></ul></p><p><u>L’éducation spécialisée</u></p><p><ul><li>Educateur / Educatrice de jeunes enfants</li><li>Moniteur éducateur / Monitrice éducatrice</li></ul></p><p><u>L’animation</u></p><p><ul><li>Animateur / Animatrice socio-culturel</li><li>Animateur / Animatrice multimédia</li></ul></p><p><u>Le travail à domicile</u></p><p><ul><li>Auxiliaire de vie</li><li>Technicien / Technicienne de l'intervention sociale et familiale</li></ul></p><p><b><u>Quelques chiffres du sec",
    }

    source_type = "job"
    source_language = "fr"
    target_framework = "rome"

    target_language = source_language

    # compatibility with findOrCreateTerm naming
    collection_pref_label = source_type
    concept_pref_label = source_value["label"]
    concept_pref_description = source_value["description"]
    soup = BeautifulSoup(concept_pref_description, "html.parser")
    concept_pref_description = soup.get_text()

    # find or create the concept
    # Search for concept
    concept_id = f"term:{provider_name}/{collection_pref_label}/{target_framework}/value/{md5(concept_pref_label)}"
    collection_id = f"term:{provider_name}/collection/{collection_pref_label}/{target_framework}"

    concept = source_mapping_engine.search_for_concept_with_mappings(concept_id)
    concept = concept[0] if concept else None

    if not concept:
        print("This concept do not exist.")

        print("a) Check if the parent collection exist")
        collection = source_mapping_engine.search_for_collection(collection_id)
        collection_exist = len(collection) >= 1

        if not collection_exist:
            print("The collection do not exist, create it")
            collection_label = f"{provider_name} collection for {collection_pref_label}"
            new_collection = source_mapping_engine.create_collection(collection_id, collection_label)
            print("Collection created: \n", new_collection)
        else:
            print("Collection exist")

        print("b) Create the concept linked to the collection")
        concept = source_mapping_engine.create_concept(concept_id, concept_pref_label, source_language, collection_id)
        concept = concept[0]

    print("Concept exists. Search for mappings or create them", concept["id"], "mapping size", len(concept.get("mapping", [])))
    mappings_list = []
    if concept.get("mapping"):
        print("==> Search for existings and validated mappings")

        mappings_list = concept["mapping"]
        print(f"The concept {concept['prefLabel'][0]['value']} ({concept['id']}) has mappings:")
    else:
        # stub calculation
        search_vector = embeddings_service.get_vector(concept_pref_description[:1678])
        term_matching_responses = term_matching_service.get_gql_term_matching(
            target_framework, source_type, search_vector["embeddings"]
        )

        query = ""
        access_values = lambda: (_ for _ in ()).throw(Exception("Please override"))
        if target_framework == "rome" and source_type == "job":
            access_values = lambda d: d["rome"]["employment"]["Position"]

        if target_framework == "rome" and source_type == "skill":
            access_values = lambda d: d["rome"]["skills"]["Skill_rome"]

        if target_framework == "esco" and source_type == "skill":
            access_values = lambda d: d["esco"]["Skill"]

        if target_framework == "esco" and source_type == "job":
            access_values = lambda d: d["esco"]["Occupation"]

        values = access_values(term_matching_responses)

        # build the mapping values and create them

        mappings = [
            {
                "id": f"term:{provider_name}/mapping/" + md5(f'{concept_id}-{v["id"]}'),
                "lang": target_language,
                "score": v["_met"]["score"] if "_met" in v and "score" in v["_met"] else 0,
                "target": v["id"],
                "validated": 0,
                "framework": target_framework,
                "source": "elastic-search",
                "mappingType": "skos:exactMatch",
            }
            for v in values
        ]

        mappings_create = source_mapping_engine.create_mappings(mappings)
        mappings_ids = [m["id"] for m in mappings_create]
        concept_update = source_mapping_engine.update_concept_mapping(concept_id, mappings_ids)

        print("Search for the resulting concept with mappings:")
        final_map = source_mapping_engine.search_for_concept_with_mappings(concept_id)
        final_map = final_map[0]
        mappings_list = final_map["mapping"]

        collection_category = "scale"

        infos = [
            {
                "validated": m["validated"][0],
                "score": m["score"][0],
                "prefLabel": m["target"][0].get("prefLabel", [{}])[0].get("value"),
            }
            for m in mappings_list
        ]

        del_map_id = [m["id"] for m in mappings_list]
        del_map = source_mapping_engine.delete_mappings(del_map_id)
        print("Mappings deleted", del_map)
        del_concept = source_mapping_engine.update_concept_mapping(concept_id, [])
        print("Concept.mapping property updated", del_concept)

        deleted = source_mapping_engine.delete_concept(concept_id)
        print("Concept deleted:", deleted)

        deleted = source_mapping_engine.delete_collection(collection_id)
        print("Collection deleted:", deleted)

        print("search-for-mapping-with-source process example finished")


def test_engine_mapping_for_source():
    source_mapping_engine = SourceMappingEngine()
    provider_name = "orientoi_1"
    source_value = {
        "label": "Agent2 / Agente de centre de tri de dechet",
        "description": "<h3>Définition</h3><p>Réalise des opérations de tri de déchets et produits industriels en fin de vie (textiles, plastiques, verres, composants, ...) selon les règles de sécurité, d'environnement et les impératifs de récupération (qualité, cadence, ...).<br>Peut reconditionner des produits industriels pour valorisation par réutilisation ou recyclage.<br>Peut coordonner une équipe.</p><h3>Accès au métier</h3><p>Cet emploi/métier est accessible sans diplôme ni expérience professionnelle.<br>Un ou plusieurs Certificat(s) d'Aptitude à la Conduite En Sécurité -CACES- conditionné(s) par une aptitude médicale à renouveler périodiquement peu(ven)t être requis.<br>Des vaccinations spécifiques (leptospirose, hépatite, ...) peuvent être requises selon le secteur d'activité.</p><h3>Condition du métier</h3><p>L'activité de cet emploi/métier s'exerce au sein de sociétés de services, d'associations, de collectivités territoriales, d'entreprises industrielles en contact avec différents intervenants (particuliers, conducteurs d'engins, ...).<br>Elle varie selon le lieu d'intervention et le type de produits collectés.<br>Elle peut impliquer le port de charges.<br>Le port d'équipements de protection (gants, combinaison, ...) peut être requis.</p><h3>Environnement de travail</h3><p>Structures</p><ul><li>Association</li><li>Centre Véhicules hors d'usage - VHU</li><li>Collectivité territoriale</li><li>Déchetterie</li><li>Entreprise industrielle</li><li>Ressourcerie</li><li>Société de collecte et de traitement des déchets</li><li>Société de services</li></ul><p>Secteurs</p><ul><li>Recyclage</li></ul><h3>Compétences de Base attendues</h3><table><tbody><tr><td>Réaliste</td><td>100.0 %</td></tr></tbody></table>",
    }
    source_type = "job"
    source_language = "fr"
    target_framework = "rome"

    # compatibility with findOrCreateTerm naming
    collection_pref_label = source_type
    concept_pref_label = source_value["label"]

    concept_id = f"term:{provider_name}/{collection_pref_label}/{target_framework}/value/{md5(concept_pref_label)}"
    collection_id = f"term:{provider_name}/collection/{collection_pref_label}/{target_framework}"

    mappings_list = source_mapping_engine.get_gql_create_or_find_mapping(
        provider_name, source_value, source_type, source_language, target_framework
    )
    collection_category = "scale"

    infos = [
        {
            "validated": m["validated"][0],
            "score": m["score"][0],
            "prefLabel": m["target"][0].get("prefLabel", [{}])[0].get("value"),
        }
        for m in mappings_list
    ]

    del_map_id = [m["id"] for m in mappings_list]
    del_map = source_mapping_engine.delete_mappings(del_map_id)
    print("Mappings deleted", del_map)
    del_concept = source_mapping_engine.update_concept_mapping(concept_id, [])
    print("Concept.mapping property updated", del_concept)

    deleted = source_mapping_engine.delete_concept(concept_id)
    print("Concept deleted:", deleted)

    deleted = source_mapping_engine.delete_collection(collection_id)
    print("Collection deleted:", deleted)

    print("search-for-mapping-with-source process example finished")
