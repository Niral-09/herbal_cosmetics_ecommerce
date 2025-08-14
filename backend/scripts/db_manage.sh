#!/bin/bash

# Database management script for Herbal Cosmetics E-commerce application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default database URL
DEFAULT_DB_URL="postgresql://postgres:postgres@localhost:5432/herbal_cosmetics_db"
DB_URL="${DATABASE_URL:-$DEFAULT_DB_URL}"

print_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  init     - Initialize database (create tables)"
    echo "  seed     - Seed database with initial data"
    echo "  reset    - Reset database (drop and recreate tables)"
    echo "  status   - Check database connection and table status"
    echo "  help     - Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DATABASE_URL - Database connection URL (default: $DEFAULT_DB_URL)"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🌿 Database Management Tool${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

init_db() {
    echo -e "${YELLOW}Initializing database...${NC}"
    python db_init.py
    echo -e "${GREEN}✅ Database initialization completed${NC}"
}

seed_db() {
    echo -e "${YELLOW}Seeding database with initial data...${NC}"
    python seed.py
    echo -e "${GREEN}✅ Database seeding completed${NC}"
}

reset_db() {
    echo -e "${RED}⚠️  WARNING: This will drop all existing tables and data!${NC}"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Resetting database...${NC}"
        
        # Drop all tables
        python -c "
import os
from sqlalchemy import create_engine, text
from app.core.database import Base

os.environ['DATABASE_URL'] = '$DB_URL'
engine = create_engine('$DB_URL')

print('Dropping all tables...')
Base.metadata.drop_all(bind=engine)
print('Creating all tables...')
Base.metadata.create_all(bind=engine)
print('Database reset completed!')
"
        echo -e "${GREEN}✅ Database reset completed${NC}"
        
        # Ask if user wants to seed data
        read -p "Would you like to seed the database with initial data? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            seed_db
        fi
    else
        echo -e "${YELLOW}Database reset cancelled${NC}"
    fi
}

check_status() {
    echo -e "${YELLOW}Checking database status...${NC}"
    python scripts/db_status.py
}

# Main script logic
case "${1:-help}" in
    init)
        print_header
        init_db
        ;;
    seed)
        print_header
        seed_db
        ;;
    reset)
        print_header
        reset_db
        ;;
    status)
        print_header
        check_status
        ;;
    help|--help|-h)
        print_header
        print_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        print_usage
        exit 1
        ;;
esac
