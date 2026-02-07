# NestJS Application - Chogan API
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code and configuration
COPY . .

# Set dummy DATABASE_URL for prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Generate Prisma Client
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copy everything from builder (simpler and more reliable)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/src/main.js"]
