from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import torch

app = Flask(__name__)

# Load the model
model = SentenceTransformer('Sahajtomar/french_semantic')
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model.to(device)

@app.route('/embed', methods=['POST'])
def embed_texts():
    try:
        data = request.json
        sentences = data['texts']
        embeddings = model.encode(sentences, convert_to_tensor=True, device=device)
        return jsonify({'embeddings': embeddings.cpu().numpy().tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
