import pytest
from unittest.mock import patch
from src.entrypoint import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

@patch("src.feedback.service.es")
def test_feedback(mock_es, client):
    mock_es.get.return_value = {
        "_source": {
            "suggested_skills": [
                {
                    "skill": "skill_id_1",
                    "temp_prefLabel": "skill_preflabel_1",
                    "referential": "ESCO",
                    "status": "accepted",
                    "source": "api",
                    "validated_by": "human",
                    "feedback_timestamp": 1744795537
                },
                {
                    "skill": "skill_id_2",
                    "temp_prefLabel": "skill_preflabel_2",
                    "referential": "ESCO",
                    "status": "rejected",
                    "source": "api",
                    "validated_by": "human",
                    "feedback_timestamp": 1744795537
                },
                {
                    "skill": "skill_id_3",
                    "temp_prefLabel": "skill_preflabel_3",
                    "referential": "ESCO",
                    "status": "pending",
                    "source": "api",
                    "validated_by": "human",
                    "feedback_timestamp": 1744795537
                }
            ],
            "updated_at": 1745331103.0438933
        }
    }

    payload = {
        "updates": [
            {
                "offerKey": "course_id_1",
                "skillCode": "skill_id_1",
                "accepted": True,
                "timestamp": 1744795537
            },
            {
                "offerKey": "course_id_1",
                "skillCode": "skill_id_2",
                "accepted": False,
                "timestamp": 1744795537
            }
        ]
    }

    res = client.post("/feedback", json=payload)
    assert res.status_code == 200
    data = res.get_json()

    assert "Feedback processed in" in data["result"]

    assert data["validation"] == [
        {
            "accepted": True,
            "offerKey": "course_id_1",
            "skillCode": "skill_id_1",
            "timestamp": 1744795537
        },{
            "accepted": False,
            "offerKey": "course_id_1",
            "skillCode": "skill_id_2",
            "timestamp": 1744795537
        }
    ]

@patch("src.feedback.service.es")
def test_feedback_missing_matching(mock_es, client):
    mock_es.get.return_value = {}

    payload = {
        "updates": [
            {
                "offerKey": "course_id_1",
                "skillCode": "skill_id_1",
                "accepted": True,
                "timestamp": 1744795537
            },
            {
                "offerKey": "course_id_1",
                "skillCode": "skill_id_2",
                "accepted": False,
                "timestamp": 1744795537
            }
        ]
    }

    res = client.post("/feedback", json=payload)
    assert res.status_code == 400
    error_response = res.json["error"]
    assert error_response == "Document matching not found for key: course_id_1"
