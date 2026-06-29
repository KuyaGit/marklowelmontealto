# Self-hosted Docker deployment with Cloudflare edge caching

This guide explains how to build and run the portfolio as a standalone Node.js
container on your own server while keeping Cloudflare as a CDN in front of it.

## How caching works

```
Browser → Cloudflare edge cache → your server (Docker container)
```

Next.js automatically emits CDN-friendly `Cache-Control` headers:

| Route type | Header emitted by Next |
|---|---|
| Static / ISR pages | `s-maxage=<revalidate>, stale-while-revalidate=…` |
| `/_next/static/*` | `public, max-age=31536000, immutable` |
| Dynamic / API routes | `private, no-cache, no-store` |

Cloudflare **does not cache HTML by default** — you must create a Cache Rule
(see below). Once you do, edge TTL is set to **300 seconds**, matching the
existing `revalidate: 300` in `lib/contentful.ts`. Maximum staleness after a
Contentful publish is therefore about 5–10 minutes (edge TTL + ISR window).

---

## 1 — Build the image

```bash
docker build \
  --build-arg CONTENTFUL_SPACE_ID=<your-space-id> \
  --build-arg CONTENTFUL_ACCESS_TOKEN=<your-delivery-api-token> \
  -t mlm-portfolio .
```

Contentful credentials are required at **build time** because pages are
statically prerendered. Supply them again at **runtime** (below) so ISR
revalidation can re-fetch fresh data.

---

## 2 — Run the container

```bash
docker run -d \
  -p 3000:3000 \
  -e CONTENTFUL_SPACE_ID=<your-space-id> \
  -e CONTENTFUL_ACCESS_TOKEN=<your-delivery-api-token> \
  -e CONTENTFUL_REVALIDATE_SECRET=<your-webhook-secret> \
  # -e CONTENTFUL_ENVIRONMENT=master   # optional, default: master
  --name mlm-portfolio \
  mlm-portfolio
```

Or with Docker Compose — create a `docker-compose.yml`:

```yaml
services:
  web:
    image: mlm-portfolio
    build:
      context: .
      args:
        CONTENTFUL_SPACE_ID: ${CONTENTFUL_SPACE_ID}
        CONTENTFUL_ACCESS_TOKEN: ${CONTENTFUL_ACCESS_TOKEN}
    ports:
      - "3000:3000"
    environment:
      CONTENTFUL_SPACE_ID: ${CONTENTFUL_SPACE_ID}
      CONTENTFUL_ACCESS_TOKEN: ${CONTENTFUL_ACCESS_TOKEN}
      CONTENTFUL_REVALIDATE_SECRET: ${CONTENTFUL_REVALIDATE_SECRET}
      # CONTENTFUL_ENVIRONMENT: master
    restart: unless-stopped
```

Put secrets in a `.env` file (git-ignored) and run `docker compose up -d`.

---

## 3 — Cloudflare Cache Rule (required for HTML caching)

Your domain is already proxied through Cloudflare (orange cloud). You only
need to create one Cache Rule.

**Cloudflare dashboard → your domain → Caching → Cache Rules → Create rule**

| Field | Value |
|---|---|
| Rule name | `Cache portfolio pages` |
| When… | Custom filter expression |
| Expression | `(not starts_with(http.request.uri.path, "/api/"))` |
| Cache eligibility | **Eligible for cache** |
| Edge TTL | Override origin TTL → **300 seconds** |
| Browser TTL | Respect origin headers |
| Cache key — query string | **Include all parameters** (default — do not change) |

> **Why include query parameters?** Next.js uses the `_rsc` query parameter to
> distinguish RSC payloads from full HTML responses. Stripping it would cause
> Cloudflare to serve cached HTML to RSC requests, breaking client-side
> navigation.

> **Why exclude `/api/`?** Cache Rules only match GET/HEAD requests, so the
> `POST /api/revalidate` Contentful webhook is never cached regardless. The
> exclusion is belt-and-suspenders in case you add GET API routes later.

`/_next/static/*` assets are already cached by Cloudflare's default rules
(they carry `immutable` headers) — no extra rule needed.

---

## 4 — Contentful webhook

The existing `POST /api/revalidate` route invalidates the server-side ISR
cache on Contentful publish. Configure the webhook in Contentful:

- **URL**: `https://marklowelmontealto.com/api/revalidate`
- **Triggers**: Entry publish · Entry unpublish · Asset publish · Asset unpublish
- **Custom header**: `x-revalidate-secret: <CONTENTFUL_REVALIDATE_SECRET>`

After the server cache is invalidated, the Cloudflare edge cache expires on
its own within 300 seconds. No Cloudflare purge call is needed with the
current 5-minute edge TTL strategy.

---

## 5 — Verification

### Origin headers (run locally, no Cloudflare involved)

```bash
# Homepage — expect s-maxage in the Cache-Control header
curl -sI http://localhost:3000/ | grep -i cache-control

# Static asset — expect public, max-age=31536000, immutable
curl -sI "http://localhost:3000/_next/static/$(ls .next/static/chunks/ | head -1)" \
  | grep -i cache-control
```

### Container health

```bash
docker inspect --format '{{.State.Health.Status}}' mlm-portfolio
# → healthy
```

### Edge caching (through Cloudflare)

```bash
# First request — MISS or EXPIRED
curl -sI https://marklowelmontealto.com/ | grep -i cf-cache-status

# Second request — HIT
curl -sI https://marklowelmontealto.com/ | grep -i cf-cache-status

# Static asset — should be HIT quickly
curl -sI "https://marklowelmontealto.com/_next/static/chunks/main.js" \
  | grep -i cf-cache-status
```

---

## Optional upgrade: instant edge purge on publish

If you want Cloudflare's edge to reflect a Contentful publish immediately
(rather than waiting up to 5 min), add a Cloudflare purge call inside
`app/api/revalidate/route.ts`:

1. Create a Cloudflare API token with **Cache Purge** permission for your zone.
2. Add `CF_ZONE_ID` and `CF_PURGE_TOKEN` as runtime env vars.
3. After `revalidateTag("contentful", "max")`, call:

```ts
await fetch(
  `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CF_PURGE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ purge_everything: true }),
  }
);
```

With this in place you can safely raise the Cache Rule edge TTL to hours or
even a day — the publish webhook keeps the edge fresh on demand.
