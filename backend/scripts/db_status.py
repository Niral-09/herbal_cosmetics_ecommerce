#!/usr/bin/env python3
"""
Database status checker for Herbal Cosmetics E-commerce application.
"""

import os
import sys
from sqlalchemy import create_engine, text

# Set default database URL if not provided
os.environ.setdefault(
    "DATABASE_URL",
    os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/herbal_cosmetics_db",
    ),
)

DATABASE_URL = os.environ["DATABASE_URL"]

def check_database_status():
    """Check database connection and list tables."""
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        
        with engine.connect() as conn:
            # Test connection
            conn.execute(text('SELECT 1'))
            print('✅ Database connection: OK')
            
            # List tables
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """))
            tables = [row[0] for row in result]
            
            if tables:
                print(f'✅ Found {len(tables)} tables:')
                for table in tables:
                    print(f'  - {table}')
            else:
                print('⚠️  No tables found in database')
                
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        sys.exit(1)
    finally:
        engine.dispose()

if __name__ == "__main__":
    check_database_status()
