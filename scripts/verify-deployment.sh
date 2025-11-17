#!/bin/bash

# ====================================
# Web Trends Timeline - Deployment Verification Script
# ====================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Web Trends Timeline - Deployment Verification${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
        ((ERRORS++))
    fi
}

check_warn() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${YELLOW}⚠${NC} $1"
        ((WARNINGS++))
    fi
}

# ====================================
# 1. Check Prerequisites
# ====================================
echo -e "${BLUE}1. Checking Prerequisites...${NC}"

command -v docker > /dev/null 2>&1
check "Docker installed"

command -v docker-compose > /dev/null 2>&1
check "Docker Compose installed"

command -v git > /dev/null 2>&1
check "Git installed"

command -v node > /dev/null 2>&1
check_warn "Node.js installed (optional for local dev)"

echo ""

# ====================================
# 2. Check Configuration Files
# ====================================
echo -e "${BLUE}2. Checking Configuration Files...${NC}"

[ -f "docker-compose.yml" ]
check "docker-compose.yml exists"

[ -f "Dockerfile" ]
check "Dockerfile exists"

[ -f "nginx.conf" ]
check "nginx.conf exists"

[ -f "backend/.env.example" ]
check "backend/.env.example exists"

[ -f "frontend/.env.example" ]
check "frontend/.env.example exists"

[ -f "backend/.env" ]
check_warn "backend/.env exists (copy from .env.example)"

[ -f "frontend/.env" ]
check_warn "frontend/.env exists (copy from .env.example)"

echo ""

# ====================================
# 3. Check Environment Variables
# ====================================
echo -e "${BLUE}3. Checking Environment Variables...${NC}"

if [ -f "backend/.env" ]; then
    # Check critical backend env vars
    grep -q "JWT_SECRET" backend/.env && [ "$(grep JWT_SECRET backend/.env | cut -d= -f2)" != "your-super-secret-jwt-key-change-this-in-production" ]
    check_warn "JWT_SECRET configured (not default)"

    grep -q "STRIPE_SECRET_KEY" backend/.env
    check_warn "STRIPE_SECRET_KEY set"

    grep -q "STRIPE_WEBHOOK_SECRET" backend/.env
    check_warn "STRIPE_WEBHOOK_SECRET set"

    grep -q "DATABASE_URL" backend/.env
    check "DATABASE_URL configured"

    grep -q "FRONTEND_URL" backend/.env
    check "FRONTEND_URL configured"
else
    echo -e "${YELLOW}⚠${NC} backend/.env not found - please create from .env.example"
    ((WARNINGS++))
fi

if [ -f "frontend/.env" ]; then
    grep -q "VITE_API_URL" frontend/.env
    check "VITE_API_URL configured"

    grep -q "VITE_STRIPE_PUBLIC_KEY" frontend/.env
    check_warn "VITE_STRIPE_PUBLIC_KEY set"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env not found - please create from .env.example"
    ((WARNINGS++))
fi

echo ""

# ====================================
# 4. Check Source Code
# ====================================
echo -e "${BLUE}4. Checking Source Code...${NC}"

[ -d "frontend/src" ]
check "Frontend source exists"

[ -d "backend/src" ]
check "Backend source exists"

[ -f "frontend/package.json" ]
check "Frontend package.json exists"

[ -f "backend/package.json" ]
check "Backend package.json exists"

[ -f "package.json" ]
check "Root package.json exists (workspaces)"

echo ""

# ====================================
# 5. Check Scripts
# ====================================
echo -e "${BLUE}5. Checking Deployment Scripts...${NC}"

[ -f "scripts/deploy.sh" ] && [ -x "scripts/deploy.sh" ]
check "deploy.sh exists and executable"

[ -f "scripts/backup.sh" ] && [ -x "scripts/backup.sh" ]
check "backup.sh exists and executable"

[ -f "scripts/health-check.sh" ] && [ -x "scripts/health-check.sh" ]
check "health-check.sh exists and executable"

echo ""

# ====================================
# 6. Check Documentation
# ====================================
echo -e "${BLUE}6. Checking Documentation...${NC}"

[ -f "README.md" ]
check "README.md exists"

[ -f "DEPLOYMENT.md" ]
check "DEPLOYMENT.md exists"

[ -f "PRODUCTION_CHECKLIST.md" ]
check "PRODUCTION_CHECKLIST.md exists"

[ -f "API.md" ]
check_warn "API.md exists (optional)"

echo ""

# ====================================
# 7. Check Build Files
# ====================================
echo -e "${BLUE}7. Checking Build Configuration...${NC}"

[ -f "frontend/vite.config.ts" ]
check "Vite config exists"

[ -f "backend/tsconfig.json" ]
check "Backend TypeScript config exists"

[ -f "frontend/tsconfig.json" ]
check "Frontend TypeScript config exists"

echo ""

# ====================================
# 8. Test Build (Optional)
# ====================================
echo -e "${BLUE}8. Testing Build...${NC}"

if command -v npm > /dev/null 2>&1; then
    echo "Running 'npm run build' (this may take a while)..."
    npm run build > /dev/null 2>&1
    check_warn "Production build successful"
else
    echo -e "${YELLOW}⚠${NC} npm not available - skipping build test"
    ((WARNINGS++))
fi

echo ""

# ====================================
# 9. Check Git Status
# ====================================
echo -e "${BLUE}9. Checking Git Status...${NC}"

git status > /dev/null 2>&1
check "Git repository initialized"

# Check for uncommitted changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${GREEN}✓${NC} No uncommitted changes"
else
    echo -e "${YELLOW}⚠${NC} Uncommitted changes detected"
    ((WARNINGS++))
fi

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
if [ "$UNTRACKED" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No untracked files"
else
    echo -e "${YELLOW}⚠${NC} $UNTRACKED untracked files"
fi

echo ""

# ====================================
# Summary
# ====================================
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Verification Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! Everything looks good!${NC}"
    echo ""
    echo "You are ready to deploy to production!"
    echo ""
    echo "Next steps:"
    echo "  1. Review PRODUCTION_CHECKLIST.md"
    echo "  2. Configure environment variables"
    echo "  3. Run: ./scripts/deploy.sh"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Almost ready! ${WARNINGS} warnings found.${NC}"
    echo ""
    echo "Please review the warnings above and fix if necessary."
    echo ""
    echo "You can proceed with deployment, but review:"
    echo "  - PRODUCTION_CHECKLIST.md"
    echo "  - Environment variables configuration"
    echo ""
    exit 0
else
    echo -e "${RED}❌ ${ERRORS} errors and ${WARNINGS} warnings found.${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    echo ""
    exit 1
fi
