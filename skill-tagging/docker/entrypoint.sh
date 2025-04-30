#!/bin/sh
set -e

if [ "$1" = 'gunicorn' ] || [ "$1" = 'python' ]; then
    echo "Application starting.."
    echo "Environment : ${FLASK_ENV}"
    echo "User : $(whoami)"

    python src/fetch_model.py

    if [ -z "$(ls -A '.nltk/' 2>/dev/null)" ]; then
        echo "Fetching nltk data..."
        python -c "import nltk; nltk.download(['punkt', 'punkt_tab'], download_dir='./.nltk', quiet=False)"
        echo "nltk data fetched."
    else
        echo "nltk data already fetched."
    fi
    echo "Application up and running"
fi

exec "$@"