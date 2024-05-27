# Live Embedding API

docker build --pull --rm -f "services/embeddings/dockerfile" -t embedding:latest "services/embeddings" 

curl -X POST http://172.17.0.2:5000/embed -H "Content-Type: application/json" -d '{"texts": ["Bonjour, comment ça va?"]}'

