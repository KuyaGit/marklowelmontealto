# Stage 1 — install dependencies
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2 — build the Next.js standalone output
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Contentful credentials are required at build time because pages are
# statically prerendered; they are also needed at runtime for ISR.


ENV DOCKER_BUILD=true

RUN npm run build

# Stage 3 — minimal production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Pass CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN at runtime via -e flags
CMD ["node", "server.js"]
