# Tests

## Run tests
### AI Translator
1. `docker compose exec ai-translator-api pytest --no-header --disable-warnings --tb=short -v tests/unit/`
2. `docker compose exec ai-translator-api pytest --no-header --disable-warnings --tb=short -v tests/api/`
### Skill tagging
1. `docker compose exec ai-translator-skill-tagging pytest --no-header --disable-warnings --tb=short -v tests/api/`
