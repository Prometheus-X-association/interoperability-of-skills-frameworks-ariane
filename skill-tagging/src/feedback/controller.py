from flask import Blueprint, request, jsonify
from ..logger import logger
import time
from .service import process_feedback_logic


feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST"])
def process_feedback():
    start_time = time.time()
    try:
        result = process_feedback_logic(request.get_json())
        duration = round(time.time() - start_time, 2)
        result["result"] = f"Feedback processed in {duration}s"
        logger.info(result)
        return jsonify(result)
    except ValueError as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    except KeyError as e:
        logger.error(str(e))
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        logger.exception("An error occurred while processing the feedback")
        return jsonify({"error": str(e)}), 500