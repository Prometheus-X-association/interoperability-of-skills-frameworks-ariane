import requests
from dotenv import load_dotenv
from api.config import get_api_settings
import redis
from redis import client
from fastapi.responses import JSONResponse
from api.engines.machine_learning_engine.embeddings import Embeddings


class EmbeddingService:

    def __init__(self) -> None:
        settings = get_api_settings()
        self.embeddings = Embeddings("Sahajtomar/french_semantic")
        self.api_url = settings.embedding_url  # "http://127.0.0.1:5000/embed"

    def generate_mapping_from_rules_provided(self) -> dict:
        # Dummy method - replace with actual implementation
        pass

    def get_vector_from_flask(self, texts: list[str]) -> dict:
        """
        Sends a list of texts to the embedding API and receives the response.

        Args:
            texts (list): A list of strings to be sent for embedding.

        Returns:
            dict: The response from the API as a dictionary.
        """
        payload = {"texts": texts}
        response = requests.post(f"{self.api_url}/embed", json=payload)

        # Check if the request was successful
        if response.status_code == 200:
            return response.json()
        else:
            return {
                "error": "Failed to get response from API",
                "status_code": response.status_code,
            }

    def get_vector(self, texts: list[str]) -> dict:
        """
        Sends a list of texts to the embedding API and receives the response.

        Args:
            texts (list): A list of strings to be sent for embedding.
            WARNING : In order to by pass the 1678 limitation of the string we have change it to send only the first element of the list.
        Returns:
            dict: The response from the API as a dictionary.
        """
<<<<<<< HEAD
        if isinstance(texts, str):
            response = self.embeddings.embed_text(texts)
        else: 
            response = self.embeddings.embed_text(texts[0])
=======
        response = self.embeddings.embed_text(texts[0])
>>>>>>> 3b02988 (refactor and update folders)
        return {"embeddings": response}
