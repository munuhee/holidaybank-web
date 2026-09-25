# Holidaybank Expeditions: web

The public website and `/admin` dashboard (Next.js 15, App Router, React 19, Tailwind CSS v4).
It reads everything from the Django API in the separate **holidaybank-api** repo; start that first.
Its README covers the content inventory and architecture.

Requirements: Node 20+.

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000, API expected on :8000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | The API as browsers reach it |
| `API_INTERNAL_URL` | Optional: the API as the Next.js server reaches it (Docker: `http://api:8000`). Also proxied at `/backend/*` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, for metadata and the sitemap |
| `REVALIDATE_SECRET` | Must equal the API's; lets admin saves refresh public pages |
| `NEXT_PUBLIC_TAWK_SRC` | Optional Tawk.to embed URL, which enables live chat |

The admin area is linked from nowhere on the public site, is `noindex`, and is disallowed in
`robots.txt`.

## Checks

```bash
npm run lint && npx tsc --noEmit && npm run build
```

CI (`.github/workflows/ci.yml`) runs the same. The build passes without a running API.

## Images and logo

- `public/images/` holds 80 photographs. Every one is registered in the API's media
  library (`ImageAsset`) with alt text, source, photographer, licence and dimensions. Content points
  at these records rather than embedding URLs. Credits are shown on banners and at `/credits`.
- **9 are from the original site.** They carry no credit line because their provenance hasn't
  been confirmed. Confirm before launch.
- **71 are from Pexels**: 55 reused from the Lekker project with their recorded credits, and 16
  added for Europe and Nairobi. See `public/images/CREDITS.md`.
- The logo is rebuilt as vectors in `public/brand/`:
  - `logo.svg` for dark grounds, `logo-on-light.svg` for light ones.
  - `logo-compact(-on-light).svg` omits the tagline, for the header.
  - `logo-mark.svg` is the plane, swoosh and giraffes only; it is also the favicon.

## Site and API on unrelated domains

When the site and API share no parent domain (for example `holidaybank.netlify.app` and
`holidaybank-api-production.up.railway.app`), the admin cookie set by the API is invisible to the
site. Route the browser through the built-in proxy instead:

```
NEXT_PUBLIC_API_URL=https://holidaybank.netlify.app/backend
API_INTERNAL_URL=https://holidaybank-api-production.up.railway.app
```

