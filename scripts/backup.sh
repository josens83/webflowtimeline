#!/bin/bash

# ====================================
# Web Trends Timeline - Database Backup Script
# ====================================

set -e  # Exit on error

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_FILE="backend/database.db"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}💾 Starting database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ ! -f "$DATABASE_FILE" ]; then
    echo "Database file not found at $DATABASE_FILE"
    exit 1
fi

# Create backup filename
BACKUP_FILE="$BACKUP_DIR/database_backup_$TIMESTAMP.db"

# Copy database file
cp "$DATABASE_FILE" "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gz"

echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup size: $BACKUP_SIZE"

# Clean up old backups (keep last 30 days)
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "database_backup_*.db.gz" -mtime +30 -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/database_backup_*.db.gz 2>/dev/null | wc -l)
echo "Total backups: $BACKUP_COUNT"

echo -e "${GREEN}✅ Backup complete${NC}"
