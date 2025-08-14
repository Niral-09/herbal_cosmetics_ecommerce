# Database Setup Guide

This guide explains how to set up and manage the database for the Herbal Cosmetics E-commerce application.

## Overview

The application uses PostgreSQL as the database and includes the following tables:

- **users** - User accounts (customers and admins)
- **addresses** - User shipping/billing addresses
- **refresh_tokens** - JWT refresh tokens for authentication
- **categories** - Product categories (hierarchical)
- **products** - Product catalog
- **product_images** - Product images and media
- **product_variants** - Product variants (size, color, etc.)
- **product_categories** - Many-to-many relationship between products and categories
- **orders** - Customer orders
- **order_items** - Individual items within orders

## Quick Start with Docker

The easiest way to set up the database is using Docker Compose:

```bash
# Start the database and application
docker-compose up -d

# The startup script will automatically:
# 1. Wait for PostgreSQL to be ready
# 2. Create all database tables
# 3. Seed initial data (categories, products, users)
# 4. Start the FastAPI application
```

## Manual Database Setup

### 1. Database Initialization

Create all required tables:

```bash
# Using Python script directly
python db_init.py

# Using management script (Linux/Mac)
./scripts/db_manage.sh init

# Using management script (Windows)
scripts\db_manage.bat init
```

### 2. Data Seeding

Populate the database with initial data:

```bash
# Using Python script directly
python seed.py

# Using management script (Linux/Mac)
./scripts/db_manage.sh seed

# Using management script (Windows)
scripts\db_manage.bat seed
```

### 3. Database Reset

Drop all tables and recreate them:

```bash
# Using management script (Linux/Mac)
./scripts/db_manage.sh reset

# Using management script (Windows)
scripts\db_manage.bat reset
```

### 4. Check Database Status

Verify database connection and list tables:

```bash
# Using management script (Linux/Mac)
./scripts/db_manage.sh status

# Using management script (Windows)
scripts\db_manage.bat status
```

## Environment Variables

Configure the database connection using environment variables:

```bash
# Default (for local development)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/herbal_cosmetics_db

# For Docker
DATABASE_URL=postgresql://postgres:postgres@db:5432/herbal_cosmetics_db

# For production
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## Application Startup Options

The `startup.py` script provides flexible startup options:

```bash
# Full startup (init + seed + start app)
python startup.py

# Skip database initialization
python startup.py --skip-init

# Skip data seeding
python startup.py --skip-seed

# Only initialize database (don't start app)
python startup.py --init-only

# Only seed data (don't start app)
python startup.py --seed-only
```

## Initial Data

The seeding process creates:

### Categories
- Hair Care
  - Shampoos
  - Conditioners
- Skin Care
  - Moisturizers

### Products
- Herbal Anti-Dandruff Shampoo (200ml, 500ml variants)
- Aloe Moisturizing Cream (50g, 100g variants)

### Users
- **Admin User**
  - Email: admin@herbalcosmetics.com
  - Password: Admin@123
  - Role: admin

- **Test Customers**
  - Email: customer1@example.com
  - Password: Pass@1234
  - Role: customer

  - Email: customer2@example.com
  - Password: Pass@1234
  - Role: customer

### Sample Orders
- One order for each order status (pending, confirmed, processing, shipped, delivered, cancelled, refunded)

## Troubleshooting

### Database Connection Issues

1. **PostgreSQL not running**: Ensure PostgreSQL is installed and running
2. **Wrong credentials**: Check DATABASE_URL environment variable
3. **Database doesn't exist**: Create the database manually:
   ```sql
   CREATE DATABASE herbal_cosmetics_db;
   ```

### Docker Issues

1. **Port conflicts**: Ensure ports 5432 and 8000 are available
2. **Permission issues**: On Linux/Mac, ensure Docker has proper permissions
3. **Container startup order**: The docker-compose.yml includes health checks to ensure proper startup order

### Table Creation Issues

1. **Import errors**: Ensure all model files are properly imported in `db_init.py`
2. **SQLAlchemy version**: Ensure compatible SQLAlchemy version in requirements.txt
3. **PostgreSQL extensions**: Some features may require specific PostgreSQL extensions

## Development Workflow

1. **Start development environment**:
   ```bash
   docker-compose up -d db  # Start only database
   python startup.py        # Start app with full initialization
   ```

2. **Reset database during development**:
   ```bash
   ./scripts/db_manage.sh reset  # Linux/Mac
   scripts\db_manage.bat reset   # Windows
   ```

3. **Add new models**:
   - Create model file in `app/models/`
   - Import model in `app/models/__init__.py`
   - Import model in `db_init.py`
   - Run database reset or use Alembic migrations

## Production Deployment

For production deployment:

1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Set proper DATABASE_URL environment variable
3. Use `python startup.py --skip-seed` to avoid overwriting production data
4. Consider using Alembic for database migrations instead of dropping/recreating tables

## Security Notes

- Change default passwords in production
- Use strong database credentials
- Enable SSL for database connections in production
- Regularly backup your database
- Consider using database connection pooling for high-traffic applications
