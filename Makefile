SHELL := /bin/bash

tests-ariane-unit:
	docker compose exec api uv run pytest --no-header --disable-warnings --tb=short -s -vv tests/unit/

tests-ariane-api:
	docker compose exec api uv run pytest --no-header --disable-warnings --tb=short -s -v tests/api/

tests-ariane-skill-tagging:
	docker compose exec skill-tagging pytest --no-header --disable-warnings --tb=short -s -v tests/api/

tests:
	docker compose up --build -d
	make tests-ariane-unit
	make tests-ariane-api
	make tests-ariane-skill-tagging
	docker compose down -v

load-elasticsearch:
	./scripts/import_es.sh

clean-elasticsearch-index:
	./scripts/clean_index.sh

load-fixtures:
	docker compose exec api python -m fixtures.load_all

load-all:
	make load-elasticsearch
	make load-fixtures