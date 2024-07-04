from pathlib import Path
from sentence_transformers import SentenceTransformer
import torch
import os


class Embeddings:

    def __init__(self, model_identifier: str) -> None:
        # Load the model
        self.model_identifier = model_identifier
        cwd = Path(__file__).parent
        self.modelPath = f"{cwd}/models_dump/{model_identifier}"

        if not os.path.exists(self.modelPath):
            self.model = SentenceTransformer(model_identifier)
            self.model.save(self.modelPath)
        else:
            self.model = SentenceTransformer(self.modelPath)

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def embed_texts(self, sentences: list[list[str]]) -> list[list[str]]:
        embeddings = self.model.encode(sentences, convert_to_tensor=True, device=self.device)
        embeddings_vector = embeddings.cpu().numpy().tolist()
        return embeddings_vector

    def embed_text(self, text, chunk_size=1000):
        chunks = [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]
        # Compute embeddings for each chunk
        chunk_embeddings = [self.model.encode(chunk, convert_to_tensor=True) for chunk in chunks]
        try:
            # Average the embeddings
            avg_embedding = sum(chunk_embeddings) / len(chunk_embeddings)
            return avg_embedding.tolist()
        except:
            return [0] * 1024
