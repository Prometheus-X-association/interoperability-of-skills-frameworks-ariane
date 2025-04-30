SHELL := /bin/bash

tests-ai-translator-unit:
	docker compose exec ai-translator-api uv run pytest --no-header --disable-warnings --tb=short -s -vv tests/unit/

tests-ai-translator-api:
	docker compose exec ai-translator-api uv run pytest --no-header --disable-warnings --tb=short -s -v tests/api/

tests-skill-tagging-api:
	docker compose exec skill-tagging-api pytest --no-header --disable-warnings --tb=short -s -v tests/api/

tests:
	docker compose up --build -d
	make tests-ai-translator-unit
	make tests-ai-translator-api
	make tests-skill-tagging-api
	docker compose down -v

load-elasticsearch:
	./scripts/import_es.sh

clean-elasticsearch-index:
	./scripts/clean_index.sh

load-fixtures:
	docker compose exec ai-translator-api python -m fixtures.load_all

load-all:
	make load-elasticsearch
	make load-fixtures