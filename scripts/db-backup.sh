#!/bin/bash

# ====================================
# Database Backup Script
# ====================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_TYPE="${DB_TYPE:-sqlite}"

echo -e "${GREEN}🗄️  Database Backup Script${NC}"
echo "Backup Type: $DB_TYPE"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

if [ "$DB_TYPE" = "sqlite" ]; then
  # SQLite Backup
  echo -e "${YELLOW}📦 Backing up SQLite database...${NC}"

  DB_FILE="./backend/database.db"

  if [ -f "$DB_FILE" ]; then
    BACKUP_FILE="$BACKUP_DIR/database_${TIMESTAMP}.db"
    cp "$DB_FILE" "$BACKUP_FILE"

    # Compress backup
    gzip "$BACKUP_FILE"

    echo -e "${GREEN}✅ SQLite backup created: ${BACKUP_FILE}.gz${NC}"

    # Show backup size
    SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    echo "Backup size: $SIZE"
  else
    echo -e "${RED}❌ Database file not found: $DB_FILE${NC}"
    exit 1
  fi

elif [ "$DB_TYPE" = "postgres" ]; then
  # PostgreSQL Backup
  echo -e "${YELLOW}📦 Backing up PostgreSQL database...${NC}"

  # Load environment variables
  if [ -f "./backend/.env" ]; then
    source ./backend/.env
  fi

  BACKUP_FILE="$BACKUP_DIR/postgres_${TIMESTAMP}.sql"

  # Use pg_dump
  PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
    -h ${POSTGRES_HOST:-localhost} \
    -p ${POSTGRES_PORT:-5432} \
    -U ${POSTGRES_USER:-postgres} \
    -d ${POSTGRES_DB:-webtrends} \
    -F p \
    -f "$BACKUP_FILE"

  # Compress backup
  gzip "$BACKUP_FILE"

  echo -e "${GREEN}✅ PostgreSQL backup created: ${BACKUP_FILE}.gz${NC}"

  # Show backup size
  SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
  echo "Backup size: $SIZE"
else
  echo -e "${RED}❌ Unknown database type: $DB_TYPE${NC}"
  echo "Use DB_TYPE=sqlite or DB_TYPE=postgres"
  exit 1
fi

# Cleanup old backups (keep last 30 days)
echo ""
echo -e "${YELLOW}🧹 Cleaning up old backups (keeping last 30 days)...${NC}"
find "$BACKUP_DIR" -name "*.gz" -type f -mtime +30 -delete

# List recent backups
echo ""
echo -e "${GREEN}📋 Recent backups:${NC}"
ls -lht "$BACKUP_DIR" | head -6

echo ""
echo -e "${GREEN}✨ Backup completed successfully!${NC}"
