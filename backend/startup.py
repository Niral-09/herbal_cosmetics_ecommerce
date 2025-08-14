#!/usr/bin/env python3
"""
Startup script for Herbal Cosmetics E-commerce application.
This script handles database initialization, table creation, and optional data seeding.
"""

import os
import sys
import argparse
from pathlib import Path

def run_db_init():
    """Run database initialization to create tables."""
    print("🔧 Running database initialization...")
    
    # Import and run db_init
    try:
        from db_init import main as db_init_main
        db_init_main()
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def run_seed_data():
    """Run data seeding to populate initial data."""
    print("🌱 Running data seeding...")
    
    # Import and run seed
    try:
        from seed import main as seed_main
        seed_main()
        return True
    except Exception as e:
        print(f"❌ Data seeding failed: {e}")
        return False

def start_application():
    """Start the FastAPI application."""
    print("🚀 Starting FastAPI application...")
    
    import uvicorn
    from app.main import app
    
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=reload
    )

def main():
    """Main startup function."""
    parser = argparse.ArgumentParser(description="Herbal Cosmetics E-commerce Startup Script")
    parser.add_argument("--skip-init", action="store_true", help="Skip database initialization")
    parser.add_argument("--skip-seed", action="store_true", help="Skip data seeding")
    parser.add_argument("--init-only", action="store_true", help="Only run database initialization")
    parser.add_argument("--seed-only", action="store_true", help="Only run data seeding")
    
    args = parser.parse_args()
    
    print("=" * 70)
    print("🌿 Herbal Cosmetics E-commerce Application Startup")
    print("=" * 70)
    
    # Handle init-only mode
    if args.init_only:
        success = run_db_init()
        sys.exit(0 if success else 1)
    
    # Handle seed-only mode
    if args.seed_only:
        success = run_seed_data()
        sys.exit(0 if success else 1)
    
    # Normal startup sequence
    init_success = True
    seed_success = True
    
    # Run database initialization unless skipped
    if not args.skip_init:
        init_success = run_db_init()
        if not init_success:
            print("❌ Startup failed due to database initialization error")
            sys.exit(1)
    
    # Run data seeding unless skipped
    if not args.skip_seed:
        seed_success = run_seed_data()
        if not seed_success:
            print("⚠️  Warning: Data seeding failed, but continuing with application startup")
    
    # Start the application
    print("=" * 70)
    start_application()

if __name__ == "__main__":
    main()
