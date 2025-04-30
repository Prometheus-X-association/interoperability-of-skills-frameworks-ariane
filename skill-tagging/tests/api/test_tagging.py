import pytest
from unittest.mock import patch
from src.entrypoint import app
from src.tagging.enum import SkillSuggestionReferentialEnum, SkillSuggestionSourceEnum, SkillSuggestionStatusEnum

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

@patch("src.tagging.service.es")
def test_tagging(mock_es, client):
    mock_es.knn_search.return_value = {
        "hits": {
            "hits": [
                {"_id": "skill_id_1", "_source": {"preferredLabel": "preflabel_1" }},
                {"_id": "skill_id_2", "_source": {"preferredLabel": "preflabel_2" }},
                {"_id": "skill_id_3", "_source": {"preferredLabel": "preflabel_3" }},
                {"_id": "skill_id_4", "_source": {"preferredLabel": "preflabel_4" }},
                {"_id": "skill_id_5", "_source": {"preferredLabel": "preflabel_5" }}
            ]
        }
    }
    mock_es.exists.return_value = False

    payload = {
        "key": "course_id_1",
        "title": "The course example title",
        "description": "The description example of the course...",
        "skills": []
    }

    res = client.post("/skillTagging", json=payload)
    assert res.status_code == 200
    data = res.get_json()

    assert data == {
        "key": "course_id_1",
        "skills": [
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_1"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_2"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_3"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_4"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_5"}
        ]
    }

@patch("src.tagging.service.es")
def test_tagging_already_exists(mock_es, client):    
    mock_es.knn_search.return_value = {
        "hits": {
            "hits": [
                {"_id": "skill_id_1", "_source": {"preferredLabel": "preflabel_1" }},
                {"_id": "skill_id_2", "_source": {"preferredLabel": "preflabel_2" }},
                {"_id": "skill_id_3", "_source": {"preferredLabel": "preflabel_3" }},
                {"_id": "skill_id_4", "_source": {"preferredLabel": "preflabel_4" }},
                {"_id": "skill_id_5", "_source": {"preferredLabel": "preflabel_5" }}
            ]
        }
    }
    mock_es.exists.return_value = True
    mock_es.get.return_value = {
        "_source": {
            "suggested_skills": [
                {"skill": "skill_id_1", "temp_prefLabel": "skill_preflabel_1", "referential": SkillSuggestionReferentialEnum.ESCO, "status": SkillSuggestionStatusEnum.PENDING, "source": SkillSuggestionSourceEnum.API},
                {"skill": "skill_id_2", "temp_prefLabel": "skill_preflabel_2", "referential": SkillSuggestionReferentialEnum.ESCO, "status": SkillSuggestionStatusEnum.VALIDATED, "source": SkillSuggestionSourceEnum.API},
                {"skill": "skill_id_3", "temp_prefLabel": "skill_preflabel_3", "referential": SkillSuggestionReferentialEnum.ESCO, "status": SkillSuggestionStatusEnum.REJECTED, "source": SkillSuggestionSourceEnum.API},
                {"skill": "skill_id_4", "temp_prefLabel": "skill_preflabel_4", "referential": SkillSuggestionReferentialEnum.ESCO, "status": SkillSuggestionStatusEnum.PENDING, "source": SkillSuggestionSourceEnum.API},
                {"skill": "skill_id_5", "temp_prefLabel": "skill_preflabel_5", "referential": SkillSuggestionReferentialEnum.ESCO, "status": SkillSuggestionStatusEnum.PENDING, "source": SkillSuggestionSourceEnum.API}
                
            ],
            "updated_at": 1745329456.3821154
        }
    }

    payload = {
        "key": "course_id_1",
        "title": "The course example title",
        "description": "The description example of the course...",
        "skills": []
    }

    res = client.post("/skillTagging", json=payload)
    assert res.status_code == 200
    data = res.get_json()

    assert data == {
        "key": "course_id_1",
        "skills": [
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_1"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_2"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_3"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_4"},
            {"referential": SkillSuggestionReferentialEnum.ESCO, "skill": "skill_id_5"}
        ]
    }
