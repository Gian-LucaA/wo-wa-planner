# Stage 1: builder
FROM node:20-bookworm-slim AS builder

WORKDIR /wowaplanner

# Install deps deterministically
COPY package.json package-lock.json ./
RUN npm ci

# Build
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY . .
RUN npm run build

# Stage 2: runner
FROM node:20-bookworm-slim AS runner

WORKDIR /wowaplanner
ENV NODE_ENV=production

# Create non-root user
RUN useradd -m -u 1001 appuser

COPY --from=builder /wowaplanner/package.json /wowaplanner/package-lock.json ./
COPY --from=builder /wowaplanner/.next ./.next
COPY --from=builder /wowaplanner/public ./public
COPY --from=builder /wowaplanner/next.config.* ./

RUN npm ci --omit=dev

# Fix permissions and drop root
RUN chown -R appuser:appuser /wowaplanner
USER appuser

EXPOSE 3000
CMD ["npm", "start"]
