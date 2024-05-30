from sentence_transformers import SentenceTransformer
import torch
<<<<<<< HEAD
import os
=======
>>>>>>> e23b4cb (machine learning local service)


class Embeddings:

    def __init__(self, model_identifier: str) -> None:
        # Load the model
<<<<<<< HEAD
        self.model_identifier = model_identifier        
        cwd=os.getcwd()
        self.modelPath =  f"{cwd}/machine_learning_engine/models_dump/{model_identifier}"

        if not os.path.exists(self.modelPath):
            print("Download the model")
            self.model = SentenceTransformer(model_identifier)
            self.model.save(self.modelPath)
        else:
            self.model = SentenceTransformer(self.modelPath)            

=======
        self.model_identifier = model_identifier
        self.model = SentenceTransformer(model_identifier)
>>>>>>> e23b4cb (machine learning local service)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def embed_texts(self, sentences: list[list[str]]) -> list[list[str]]:
<<<<<<< HEAD
        embeddings = self.model.encode(sentences, convert_to_tensor=True, device=self.device)
=======
        embeddings = self.model.encode(
            sentences, convert_to_tensor=True, device=self.device
        )
>>>>>>> e23b4cb (machine learning local service)
        embeddings_vector = embeddings.cpu().numpy().tolist()
        return embeddings_vector
