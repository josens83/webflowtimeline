#!/bin/bash

# ====================================
# Web Trends Timeline - Production Deployment Script
# ====================================

set -e  # Exit on error

echo "🚀 Starting Web Trends Timeline deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   echo -e "${RED}❌ Please do not run as root${NC}"
   exit 1
fi

# Check required commands
for cmd in docker docker-compose git; do
    if ! command -v $cmd &> /dev/null; then
        echo -e "${RED}❌ $cmd is not installed${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# 1. Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from git...${NC}"
git pull origin main

# 2. Check environment variables
echo -e "${YELLOW}🔍 Checking environment variables...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env not found!${NC}"
    echo "Please copy backend/.env.example to backend/.env and configure it"
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${RED}❌ frontend/.env not found!${NC}"
    echo "Please copy frontend/.env.example to frontend/.env and configure it"
    exit 1
fi

echo -e "${GREEN}✅ Environment files exist${NC}"

# 3. Backup database (if exists)
if [ -f "backend/database.db" ]; then
    echo -e "${YELLOW}💾 Backing up database...${NC}"
    ./scripts/backup.sh
fi

# 4. Build and deploy
echo -e "${YELLOW}🏗️  Building Docker images...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}🔄 Stopping old containers...${NC}"
docker-compose down

echo -e "${YELLOW}🚀 Starting new containers...${NC}"
docker-compose up -d

# 5. Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# 6. Health check
echo -e "${YELLOW}🏥 Running health check...${NC}"
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "Check logs with: docker-compose logs backend"
    exit 1
fi

if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${RED}❌ Frontend is not accessible${NC}"
    echo "Check logs with: docker-compose logs nginx"
    exit 1
fi

# 7. Show status
echo ""
echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost:80"
echo "  - Backend:  http://localhost:3001"
echo "  - API:      http://localhost:80/api"
echo ""
echo "Useful commands:"
echo "  - View logs:    docker-compose logs -f"
echo "  - Stop:         docker-compose down"
echo "  - Restart:      docker-compose restart"
echo "  - Status:       docker-compose ps"
echo ""
