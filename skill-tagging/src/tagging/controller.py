from flask import Blueprint, request, jsonify
import time
from ..elasticsearch.client import ElasticsearchClient
from ..logger import logger
from .service import handle_tagging


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

tagging_bp = Blueprint("tagging", __name__)

@tagging_bp.route('/skillTagging', methods=['POST'])
def extract_skills_and_suggestions():
    start_time = time.time()
    try:
        response = handle_tagging(request)
        duration = time.time() - start_time
        logger.info(f"Requête traitée en {duration}s")
        return jsonify(response)
    except Exception as e:
        logger.exception("Erreur lors du traitement de la requête")
        return jsonify({"error": str(e)}), 500