from sentence_transformers import SentenceTransformer
import torch
<<<<<<< HEAD
<<<<<<< HEAD
import os
=======
>>>>>>> e23b4cb (machine learning local service)
=======
import os
>>>>>>> 29f9ce5 (dynamic ml model)


class Embeddings:

    def __init__(self, model_identifier: str) -> None:
        # Load the model
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 29f9ce5 (dynamic ml model)
        self.model_identifier = model_identifier        
        cwd=os.getcwd()
        self.modelPath =  f"{cwd}/machine_learning_engine/models_dump/{model_identifier}"

        if not os.path.exists(self.modelPath):
<<<<<<< HEAD
            print("Download the model")
=======
>>>>>>> 29f9ce5 (dynamic ml model)
            self.model = SentenceTransformer(model_identifier)
            self.model.save(self.modelPath)
        else:
            self.model = SentenceTransformer(self.modelPath)            

<<<<<<< HEAD
=======
        self.model_identifier = model_identifier
        self.model = SentenceTransformer(model_identifier)
>>>>>>> e23b4cb (machine learning local service)
=======
>>>>>>> 29f9ce5 (dynamic ml model)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def embed_texts(self, sentences: list[list[str]]) -> list[list[str]]:
<<<<<<< HEAD
<<<<<<< HEAD
        embeddings = self.model.encode(sentences, convert_to_tensor=True, device=self.device)
=======
        embeddings = self.model.encode(
            sentences, convert_to_tensor=True, device=self.device
        )
>>>>>>> e23b4cb (machine learning local service)
=======
        embeddings = self.model.encode(sentences, convert_to_tensor=True, device=self.device)
>>>>>>> 81c1026 (term matching service)
        embeddings_vector = embeddings.cpu().numpy().tolist()
        return embeddings_vector
    
    def embed_text(text,model,chunk_size = 1000):
        chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
        # Compute embeddings for each chunk
        chunk_embeddings = [model.encode(chunk, convert_to_tensor=True) for chunk in chunks]
        try:
            # Average the embeddings
            avg_embedding = sum(chunk_embeddings) / len(chunk_embeddings)
            return avg_embedding.tolist()
        except:
            return [0] * 1024
