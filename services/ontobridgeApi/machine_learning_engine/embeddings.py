from sentence_transformers import SentenceTransformer
import torch


class Embeddings:

    def __init__(self, model_identifier: str) -> None:
        # Load the model
        self.model_identifier = model_identifier
        self.model = SentenceTransformer(model_identifier)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def embed_texts(self, sentences: list[list[str]]) -> list[list[str]]:
        embeddings = self.model.encode(
            sentences, convert_to_tensor=True, device=self.device
        )
        embeddings_vector = embeddings.cpu().numpy().tolist()
        return embeddings_vector
