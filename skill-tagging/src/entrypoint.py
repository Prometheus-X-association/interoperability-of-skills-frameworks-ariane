from flask import Flask
from .tagging.controller import tagging_bp
from .feedback.controller import feedback_bp
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.register_blueprint(tagging_bp, url_prefix="/")
app.register_blueprint(feedback_bp, url_prefix="/")
