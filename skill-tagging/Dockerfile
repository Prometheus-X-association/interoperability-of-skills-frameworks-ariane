FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=0

COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-cache -vv

FROM python:3.12-slim-bookworm AS runtime_dev

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv

ENV FLASK_ENV=development\
    FLASK_DEBUG=True \
    PATH="/app/.venv/bin:$PATH"

COPY --chmod=775 docker/entrypoint.sh /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

# HEALTHCHECK --start-period=60s CMD curl -f http://localhost:8081 || exit 1

EXPOSE 8081

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8081", "--log-level", "info", "--reload", "src.entrypoint:app"]

FROM python:3.12-slim-bookworm AS runtime_prod

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv

ENV FLASK_ENV=production\
    FLASK_DEBUG=False \
    PATH="/app/.venv/bin:$PATH"

COPY --chmod=775 docker/entrypoint.sh /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

COPY . .
# HEALTHCHECK --start-period=60s CMD curl -f http://localhost:8081 || exit 1

EXPOSE 8081

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8081", "--log-level", "info", "src.entrypoint:app"]
