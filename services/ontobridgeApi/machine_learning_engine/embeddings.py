from sentence_transformers import SentenceTransformer
import torch
import os


class Embeddings:

    def __init__(self, model_identifier: str) -> None:
        # Load the model
        self.model_identifier = model_identifier        
        cwd=os.getcwd()
        self.modelPath =  f"{cwd}/machine_learning_engine/models_dump/{model_identifier}"

        if not os.path.exists(self.modelPath):
            print("Download the model")
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
