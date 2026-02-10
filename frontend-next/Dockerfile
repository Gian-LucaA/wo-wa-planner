# Stage 1: builder
FROM node:20-bookworm-slim AS builder

WORKDIR /wowaplanner/frontend

# Install deps deterministically
COPY package.json package-lock.json ./
RUN npm ci

# Build
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY . .
RUN npm run build

# Stage 2: runner
FROM node:20-bookworm-slim AS runner

WORKDIR /wowaplanner/frontend
ENV NODE_ENV=production

# Create non-root user
RUN useradd -m -u 1001 appuser

COPY --from=builder /wowaplanner/frontend/.next/standalone ./
COPY --from=builder /wowaplanner/frontend/.next/static ./.next/static
COPY --from=builder /wowaplanner/frontend/public ./public

# Fix permissions and drop root
RUN chown -R appuser:appuser /wowaplanner/frontend
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
