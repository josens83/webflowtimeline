# Multi-stage Dockerfile for Web Trends Timeline

# ===========================================
# Stage 1: Build Frontend
# ===========================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend ./frontend
COPY shared ./shared

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# ===========================================
# Stage 2: Build Backend
# ===========================================
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install

# Copy backend source
COPY backend ./backend
COPY shared ./shared

# Build backend
WORKDIR /app/backend
RUN npm run build

# ===========================================
# Stage 3: Production Image
# ===========================================
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install --production --workspaces

# Copy built files
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy necessary files
COPY backend/src/data ./backend/src/data

# Create data directory for SQLite
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose ports
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "backend/dist/server.js"]
