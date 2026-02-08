#!/bin/bash

# Ensure script halts on error
set -e

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "Error: Virtual environment not found in venv/"
    exit 1
fi

case "$1" in
    install)
        if [ -f "requirements.txt" ]; then
            echo "Installing requirements..."
            pip install -q -r requirements.txt
            echo "Dependencies installed."
        else
            echo "requirements.txt not found."
            exit 1
        fi
        ;;
    migration)
        if [ -z "$2" ]; then
            echo "Error: Migration message required."
            echo "Usage: ./manage.sh migration \"message\""
            exit 1
        fi
        echo "Generating migration..."
        # Run alembic from src directory where alembic.ini resides
        (cd src && alembic revision --autogenerate -m "$2")
        ;;
    migrate)
        echo "Applying migrations..."
        # Run alembic from src directory where alembic.ini resides
        (cd src && alembic upgrade head)
        ;;
    *)
        echo "Usage: $0 {install|migration|migrate}"
        echo "  install   : Quietly install dependencies from requirements.txt"
        echo "  migration : Generate a new Alembic migration (requires message)"
        echo "  migrate   : Apply all pending Alembic migrations"
        exit 1
esac
