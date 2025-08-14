#!/usr/bin/env python3
"""
Database initialization script for Herbal Cosmetics E-commerce application.
This script creates all required database tables based on SQLAlchemy models.
"""

import os
import sys
import time
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Set default database URL if not provided
os.environ.setdefault(
    "DATABASE_URL",
    os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/herbal_cosmetics_db",
    ),
)

DATABASE_URL = os.environ["DATABASE_URL"]

def wait_for_db(engine, max_retries=30, retry_interval=2):
    """
    Wait for database to be available before proceeding.
    This is especially important in Docker environments where the database
    container might take some time to be ready.
    """
    print("Waiting for database to be available...")
    
    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("Database is available!")
            return True
        except OperationalError as e:
            print(f"Database not ready (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_interval)
            else:
                print("Failed to connect to database after maximum retries")
                return False
    return False

def create_tables():
    """
    Create all database tables based on SQLAlchemy models.
    """
    print(f"Connecting to database: {DATABASE_URL}")
    
    # Create engine
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    
    # Wait for database to be available
    if not wait_for_db(engine):
        print("ERROR: Could not connect to database")
        sys.exit(1)
    
    try:
        # Import Base and all models to ensure they are registered
        from app.core.database import Base
        
        # Import all models so they are registered with Base.metadata
        from app.models.user import User
        from app.models.address import Address
        from app.models.refresh_token import RefreshToken
        from app.models.category import Category
        from app.models.product import Product
        from app.models.product_image import ProductImage
        from app.models.product_variant import ProductVariant
        from app.models.product_category import ProductCategory
        from app.models.order import Order, OrderItem
        
        print("Creating all database tables...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print("✅ All database tables created successfully!")
        
        # Verify tables were created by listing them
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """))
            tables = [row[0] for row in result]
            
            print(f"✅ Created {len(tables)} tables:")
            for table in tables:
                print(f"  - {table}")
                
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        sys.exit(1)
    finally:
        engine.dispose()

def main():
    """
    Main function to initialize the database.
    """
    print("=" * 60)
    print("🚀 Herbal Cosmetics E-commerce Database Initialization")
    print("=" * 60)
    
    create_tables()
    
    print("=" * 60)
    print("✅ Database initialization completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
