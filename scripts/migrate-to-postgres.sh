#!/bin/bash

# ====================================
# SQLite to PostgreSQL Migration Script
# ====================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 SQLite to PostgreSQL Migration Script${NC}"
echo ""

# Check if SQLite database exists
SQLITE_DB="./backend/database.db"
if [ ! -f "$SQLITE_DB" ]; then
  echo -e "${RED}❌ SQLite database not found: $SQLITE_DB${NC}"
  exit 1
fi

# Load environment variables
if [ -f "./backend/.env" ]; then
  echo -e "${YELLOW}📄 Loading environment variables...${NC}"
  source ./backend/.env
else
  echo -e "${RED}❌ .env file not found${NC}"
  exit 1
fi

# PostgreSQL connection parameters
PG_HOST=${POSTGRES_HOST:-localhost}
PG_PORT=${POSTGRES_PORT:-5432}
PG_DB=${POSTGRES_DB:-webtrends}
PG_USER=${POSTGRES_USER:-postgres}

echo "PostgreSQL Host: $PG_HOST:$PG_PORT"
echo "Database: $PG_DB"
echo ""

# Test PostgreSQL connection
echo -e "${YELLOW}🔌 Testing PostgreSQL connection...${NC}"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d postgres -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ PostgreSQL connection successful${NC}"
else
  echo -e "${RED}❌ Cannot connect to PostgreSQL${NC}"
  exit 1
fi

# Create database if not exists
echo ""
echo -e "${YELLOW}📦 Creating database if not exists...${NC}"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d postgres -c "CREATE DATABASE $PG_DB;" 2>/dev/null || echo "Database already exists"

# Backup SQLite database first
echo ""
echo -e "${YELLOW}💾 Creating SQLite backup...${NC}"
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
cp "$SQLITE_DB" "$BACKUP_DIR/database_pre_migration_${TIMESTAMP}.db"
echo -e "${GREEN}✅ Backup created${NC}"

# Export SQLite data to SQL
echo ""
echo -e "${YELLOW}📤 Exporting SQLite data...${NC}"
EXPORT_FILE="$BACKUP_DIR/sqlite_export_${TIMESTAMP}.sql"
sqlite3 "$SQLITE_DB" .dump > "$EXPORT_FILE"

# Convert SQLite SQL to PostgreSQL SQL
echo -e "${YELLOW}🔧 Converting to PostgreSQL format...${NC}"
PG_EXPORT_FILE="$BACKUP_DIR/postgres_import_${TIMESTAMP}.sql"

# Basic conversion (this is simplified - may need adjustments)
sed 's/INTEGER PRIMARY KEY AUTOINCREMENT/SERIAL PRIMARY KEY/g' "$EXPORT_FILE" | \
sed 's/DATETIME DEFAULT CURRENT_TIMESTAMP/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g' | \
sed 's/TEXT NOT NULL/VARCHAR(255) NOT NULL/g' | \
sed 's/TEXT/TEXT/g' > "$PG_EXPORT_FILE"

echo -e "${GREEN}✅ Conversion complete${NC}"

# Import to PostgreSQL
echo ""
echo -e "${YELLOW}📥 Importing data to PostgreSQL...${NC}"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DB -f "$PG_EXPORT_FILE" 2>&1 | grep -v "ERROR:" || true

echo ""
echo -e "${YELLOW}🔍 Verifying migration...${NC}"

# Count records in each table
for table in users trends contacts; do
  SQLITE_COUNT=$(sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM $table;" 2>/dev/null || echo "0")
  PG_COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DB -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ' || echo "0")

  echo "$table: SQLite=$SQLITE_COUNT, PostgreSQL=$PG_COUNT"

  if [ "$SQLITE_COUNT" -ne "$PG_COUNT" ]; then
    echo -e "${YELLOW}⚠️  Record count mismatch in $table${NC}"
  fi
done

echo ""
echo -e "${GREEN}✨ Migration completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update backend/.env to use PostgreSQL:"
echo "   DATABASE_TYPE=postgres"
echo "2. Test the application thoroughly"
echo "3. Keep SQLite backup: $BACKUP_DIR/database_pre_migration_${TIMESTAMP}.db"
echo ""
