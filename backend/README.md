Herbal Cosmetics Backend (FastAPI)

Quick start
- Create and populate .env (already provided with defaults)
- Install: pip install -r requirements.txt
- Run DB (docker recommended): docker compose up -d db
- Create DB tables (later with Alembic migrations)
- Start: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Docs: /docs
Health: /health

