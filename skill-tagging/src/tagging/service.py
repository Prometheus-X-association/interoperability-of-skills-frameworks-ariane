from ..embedding.service import EmbeddingService
from ..elasticsearch.client import ElasticsearchClient
from ..utils.utils import split_text_to_chunks
import time
from ..logger import logger
from .model import SkillSuggestion, Matching
from .enum import SkillSuggestionStatusEnum, SkillSuggestionSourceEnum, SkillSuggestionReferentialEnum, SkillTypeEnum
from ..constants import ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, ES_INDEX_SEARCH_ESCO_SKILLS

model = EmbeddingService().model
es = ElasticsearchClient().client

demo_data = {
    "key": f"test-{time.time()}",
    "title": "L3 - option Eau et Sol - Hydrologie",
    "description": f"Le bilan hydrologique est l'outil primaire du gestionnaire de l'eau. Il permet de déterminer la part d'eau écoulée et évapo-transpirée dans les précipitations et donc la part des précipitations qui vont alimenter la recharge des aquifères et le débit des cours d'eau. L'objectif est d'aborder l'ensemble des notions du bilan hydrologique, de manipuler chacune des 3 variables du bilan et enfin de travailler à l'établissement d'un bilan sur un bassin versant.{time.time()}",
    "version": 1723018043,
    "language": "fr",
    "country": "France",
    "city": "Paris",
    "skills": [
            {
            "referential": "ESCO",
            "skill": "85616cc4-98bf-4355-9cf1-72ff11752848"
            },
            {
            "referential": "ESCO",
            "skill": "f9670490-8aa4-4540-b121-d440a8294aab"
            }
    ]
}

def search_skills(embedding, n, skill_type, excluded_ids):
    try:
        knn = {
            "field": "vector",
            "query_vector": embedding,
            "k": n,
            "num_candidates": 100
        }

        filter = []
        match skill_type:
            case "skill":
                filter = [{"term": {"skillType.enum": SkillTypeEnum.COMPETENCY}}]
            case "knowledge":
                filter = [{"term": {"skillType.enum": SkillTypeEnum.KNOWLEDGE}}]
            case "all":
                filter = []
            case _:
                filter = []

        if excluded_ids:
            filter.append({"bool": {"must_not": {"terms": {"_id": excluded_ids}}}})
        
        response = es.knn_search(index=ES_INDEX_SEARCH_ESCO_SKILLS, knn=knn, filter=filter)

        suggestions = [
            {
                "referential": SkillSuggestionReferentialEnum.ESCO,
                "skill": hit["_id"],
                "temp_prefLabel": hit["_source"]["preferredLabel"]
            }
            for hit in response["hits"]["hits"]
        ]
        return suggestions
    except Exception as e:
        logger.exception(f"Erreur lors de la recherche Elasticsearch: {e}")
        raise

def handle_tagging(request):
    n = int(request.args.get("n", 5))
    skill_type = request.args.get("skill_type", "all")
    demo = request.args.get("demo", False)

    if skill_type not in ["skill", "knowledge", "all"]:
        skill_type = "all"

    document = request.get_json()
    if demo:
        document = demo_data

    description = document.get("description")
    key = document.get("key")
    provided_skills = [ps["skill"] for ps in document.get("skills", [])]

    if not description or not key:
        raise ValueError("Les champs 'description' et 'key' sont requis.")

    parts = split_text_to_chunks(description)
    embeddings = model.encode(parts)

    aggregated_suggestions = {}
    for part, embedding in zip(parts, embeddings):
        suggestions = search_skills(embedding, n, skill_type, provided_skills)
        for suggestion in suggestions:
            aggregated_suggestions[suggestion["skill"]] = suggestion

    new_suggestions = [
        SkillSuggestion(
            skill=s["skill"],
            temp_prefLabel=s["temp_prefLabel"],
            referential=s.get("referential", "unknown"),
            status=SkillSuggestionStatusEnum.PENDING,
            source=SkillSuggestionSourceEnum.API
        ) for s in aggregated_suggestions.values()
    ]

    has_matchings = es.exists(index=ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, id=key)

    if has_matchings:
        existing_doc = es.get(index=ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, id=key)["_source"]
        existing_suggestions = existing_doc.get("suggested_skills", [])
        existing_ids = {s["skill"] for s in existing_suggestions}
        for suggestion in new_suggestions:
            if suggestion.skill not in existing_ids:
                existing_suggestions.append(suggestion)
        existing_doc["suggested_skills"] = existing_suggestions
        existing_doc["updated_at"] = time.time()
        es.index(index=ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, id=key, document=existing_doc)
        final_suggestions = [SkillSuggestion(**suggested_skill) for suggested_skill in existing_doc["suggested_skills"]]
    else:
        matching_doc = Matching(
            key=key,
            description=description,
            provided_skills=provided_skills,
            suggested_skills=new_suggestions,
            created_at=time.time(),
            updated_at=time.time()
        )

        es.create(index=ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, id=key, document=matching_doc.model_dump())
        final_suggestions = matching_doc.suggested_skills

    response = {
        "key": key,
        "skills": [{
            "skill": s.skill,
            "referential": s.referential
        } for s in final_suggestions]
    }

    return response
