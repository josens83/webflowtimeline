#!/bin/bash

# ====================================
# Quick Start Script - Web Trends Timeline
# ====================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Web Trends Timeline - Quick Start${NC}"
echo ""

# Step 1: Check Node.js
echo -e "${BLUE}1. Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}2. Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Setup environment
echo -e "${BLUE}3. Setting up environment variables...${NC}"
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env already exists${NC}"
fi
echo ""

# Step 4: Initialize database
echo -e "${BLUE}4. Database will be initialized on first run${NC}"
echo -e "${GREEN}✓ Ready${NC}"
echo ""

# Step 5: Instructions
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo "To start the development server:"
echo ""
echo -e "  ${YELLOW}npm run dev${NC}"
echo ""
echo "This will start:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:3001"
echo ""
echo "Default test credentials:"
echo "  Email: test@example.com"
echo "  Password: password123"
echo ""
echo -e "${YELLOW}📝 Important:${NC}"
echo "  1. Configure Stripe keys in backend/.env for payments"
echo "  2. Update JWT_SECRET in backend/.env for security"
echo "  3. Database will be created automatically on first run"
echo ""
