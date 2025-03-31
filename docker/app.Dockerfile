# Stage 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build

# Stage 2: Production Stage
FROM node:22-alpine

WORKDIR /app
RUN npm install -g pnpm turbo prisma

# Copy only the necessary files from the build stage
COPY --chown=node:node --from=builder /app/apps/api/dist ./apps/api/dist
COPY --chown=node:node --from=builder /app/apps/api/package.json ./apps/api
COPY --chown=node:node --from=builder /app/apps/api/prisma ./apps/api/prisma

COPY --chown=node:node --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --chown=node:node --from=builder /app/packages/shared/package.json ./packages/shared

COPY --chown=node:node --from=builder /app/apps/client/dist ./apps/client 
COPY --chown=node:node --from=builder /app/packages/shared/dist ./apps/packages/shared

COPY --chown=node:node --from=builder /app/package.json .
COPY --chown=node:node --from=builder /app/pnpm-workspace.yaml .
COPY --chown=node:node --from=builder /app/pnpm-lock.yaml .
COPY --chown=node:node --from=builder /app/turbo.json .

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Expose the port that the application will run on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start:prod"]