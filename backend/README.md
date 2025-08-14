Herbal Cosmetics Backend (FastAPI)

Quick start
- Create and populate .env
- Install: pip install -r requirements.txt
- Run DB (docker recommended): docker compose up -d db
- Create DB tables: alembic upgrade head
- Start: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Docs: /docs
Health: /health

Seeding demo data
- From backend/: python scripts/seed.py
- This creates categories, products (with variants & images), users (admin & customers), and orders across statuses.

