#!/bin/bash

# ====================================
# Web Trends Timeline - Health Check Script
# ====================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 Running health checks..."
echo ""

# Check backend
echo -n "Backend API: "
if curl -f -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Down${NC}"
    FAILED=1
fi

# Check frontend
echo -n "Frontend:    "
if curl -f -s http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${RED}❌ Down${NC}"
    FAILED=1
fi

# Check Docker containers
echo ""
echo "Docker Containers:"
docker-compose ps

# Check disk space
echo ""
echo "Disk Usage:"
df -h | grep -E 'Filesystem|/$'

# Check memory
echo ""
echo "Memory Usage:"
free -h

echo ""
if [ -z "$FAILED" ]; then
    echo -e "${GREEN}✅ All checks passed${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed${NC}"
    exit 1
fi
