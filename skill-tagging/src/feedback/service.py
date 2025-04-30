from .model import FeedbackModel
from ..elasticsearch.client import ElasticsearchClient
from ..constants import ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS
import time
import os

es = ElasticsearchClient().client

def process_feedback_logic(payload: dict) -> dict:
    if not payload:
        raise ValueError("Payload must not be empty")

    updates = payload.get("updates")
    if not isinstance(updates, list):
        raise ValueError("Payload must be an array of updates")

    processed_skills = []

    for data in updates:
        feedback = FeedbackModel(**data)

        try:
            matching = es.get(index=ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, id=feedback.offerKey)["_source"]
        except Exception:
            raise ValueError(f"Document matching not found for key: {feedback.offerKey}")

        suggestions = matching.get("suggested_skills", [])
        found = False

        for suggestion in suggestions:
            if suggestion["skill"] == feedback.skillCode:
                suggestion["status"] = "validated" if feedback.accepted else "rejected"
                suggestion["validated_by"] = "human"
                suggestion["feedback_timestamp"] = feedback.timestamp
                found = True
                break

        if not found:
            raise ValueError(f"Suggestion for skill {feedback.skillCode} not found in matching document")

        matching["updated_at"] = time.time()
        es.index(index=ES_INDEX_SEARCH_SKILL_TAGGING_MATCHINGS, id=feedback.offerKey, document=matching)

        processed_skills.append(feedback.__dict__)

    return {
        "validation": processed_skills
    }