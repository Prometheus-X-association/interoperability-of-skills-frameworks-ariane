import torch
from pathlib import Path
from sentence_transformers import SentenceTransformer

class EmbeddingService:
    _instance = None

    MODEL_IDENTIFIER = "paraphrase-multilingual-mpnet-base-v2"
    MODEL_PATH = f"{Path(__file__).parent.parent.parent}/.model/{MODEL_IDENTIFIER}"

    DEVICE_TYPE_CUDA = "cuda"
    DEVICE_TYPE_CPU = "cpu"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.model = SentenceTransformer(self.MODEL_PATH)
        self.device = self.DEVICE_TYPE_CUDA if torch.cuda.is_available() else self.DEVICE_TYPE_CPU
        self.model.to(self.device)
        self._initialized = True
