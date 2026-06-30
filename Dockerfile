# ---------------------------------------------------------------------------
# Stage 1 — install dependencies
# ---------------------------------------------------------------------------
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2 — build the Next.js standalone output
#
# Pass Contentful credentials as build args because pages are statically
# prerendered at build time. They are also needed at runtime for ISR — supply
# them again via `docker run -e` / Docker Compose environment fields.
# ---------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG CONTENTFUL_SPACE_ID
ARG CONTENTFUL_ACCESS_TOKEN
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

# DOCKER_BUILD=true → next.config.ts sets output:"standalone" and skips the
# OpenNext Cloudflare dev proxy (initOpenNextCloudflareForDev is not called).
ENV DOCKER_BUILD=true \
    CONTENTFUL_SPACE_ID=$CONTENTFUL_SPACE_ID \
    CONTENTFUL_ACCESS_TOKEN=$CONTENTFUL_ACCESS_TOKEN \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL 

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3 — minimal production image
# ---------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

# DOCKER_BUILD=true at runtime prevents next.config.ts from trying to import
# @opennextjs/cloudflare (which is not present / not needed in this image).
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DOCKER_BUILD=true

# ---------------------------------------------------------------------------
# Runtime environment variables — pass via `docker run -e` or Docker Compose:
#
#   CONTENTFUL_SPACE_ID          — Contentful space ID (required for ISR)
#   CONTENTFUL_ACCESS_TOKEN      — Contentful Delivery API token (required for ISR)
#   CONTENTFUL_ENVIRONMENT       — Contentful environment (optional, default: master)
#   CONTENTFUL_REVALIDATE_SECRET — Secret for POST /api/revalidate webhook (required)
# ---------------------------------------------------------------------------

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Health check — hits /robots.txt (force-static route, zero Contentful I/O).
# Start after 10 s, check every 30 s, fail after 3 consecutive misses.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt > /dev/null || exit 1

CMD ["node", "server.js"]
