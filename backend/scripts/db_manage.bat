@echo off
REM Database management script for Herbal Cosmetics E-commerce application

setlocal enabledelayedexpansion

REM Default database URL
set DEFAULT_DB_URL=postgresql://postgres:postgres@localhost:5432/herbal_cosmetics_db
if "%DATABASE_URL%"=="" set DATABASE_URL=%DEFAULT_DB_URL%

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="--help" goto help
if "%1"=="-h" goto help
if "%1"=="init" goto init
if "%1"=="seed" goto seed
if "%1"=="reset" goto reset
if "%1"=="status" goto status

echo ❌ Unknown command: %1
echo.
goto help

:help
echo ================================
echo 🌿 Database Management Tool
echo ================================
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   init     - Initialize database (create tables)
echo   seed     - Seed database with initial data
echo   reset    - Reset database (drop and recreate tables)
echo   status   - Check database connection and table status
echo   help     - Show this help message
echo.
echo Environment Variables:
echo   DATABASE_URL - Database connection URL (default: %DEFAULT_DB_URL%)
goto end

:init
echo ================================
echo 🌿 Database Management Tool
echo ================================
echo.
echo Initializing database...
python db_init.py
if %errorlevel% equ 0 (
    echo ✅ Database initialization completed
) else (
    echo ❌ Database initialization failed
    exit /b 1
)
goto end

:seed
echo ================================
echo 🌿 Database Management Tool
echo ================================
echo.
echo Seeding database with initial data...
python seed.py
if %errorlevel% equ 0 (
    echo ✅ Database seeding completed
) else (
    echo ❌ Database seeding failed
    exit /b 1
)
goto end

:reset
echo ================================
echo 🌿 Database Management Tool
echo ================================
echo.
echo ⚠️  WARNING: This will drop all existing tables and data!
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Database reset cancelled
    goto end
)

echo Resetting database...
python -c "import os; from sqlalchemy import create_engine; from app.core.database import Base; os.environ['DATABASE_URL'] = '%DATABASE_URL%'; engine = create_engine('%DATABASE_URL%'); print('Dropping all tables...'); Base.metadata.drop_all(bind=engine); print('Creating all tables...'); Base.metadata.create_all(bind=engine); print('Database reset completed!')"

if %errorlevel% equ 0 (
    echo ✅ Database reset completed
    set /p seed_confirm="Would you like to seed the database with initial data? (y/N): "
    if /i "!seed_confirm!"=="y" (
        echo Seeding database with initial data...
        python seed.py
        if !errorlevel! equ 0 (
            echo ✅ Database seeding completed
        ) else (
            echo ❌ Database seeding failed
        )
    )
) else (
    echo ❌ Database reset failed
    exit /b 1
)
goto end

:status
echo ================================
echo 🌿 Database Management Tool
echo ================================
echo.
echo Checking database status...
python scripts\db_status.py
goto end

:end
endlocal
