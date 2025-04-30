from src.embedding.service import EmbeddingService
import hashlib
import nltk
nltk.data.path.append("./.nltk")
from nltk.tokenize import sent_tokenize

tokenizer = EmbeddingService().model.tokenizer

def generate_id(text):
    return hashlib.md5(text.encode()).hexdigest()

def split_text_to_chunks(text, max_tokens=128):
    sentences = sent_tokenize(text)
    chunks, current_chunk, current_len = [], [], 0

    for sent in sentences:
        sent_len = len(tokenizer.tokenize(sent))
        if current_len + sent_len <= max_tokens:
            current_chunk.append(sent)
            current_len += sent_len
        else:
            chunks.append(' '.join(current_chunk))
            current_chunk = [sent]
            current_len = sent_len

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks
