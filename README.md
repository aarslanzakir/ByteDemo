# Byte demo client website

A sample client website that loads all its content from Byte, built the way
**Byte → Websites → Settings → Developer setup** describes:

- `lib/byte.js`: loads content in three layers: cache, then live from Byte, then `content/default-content.json` if Byte can't be reached.
- `app/[[...slug]]/page.jsx`: every page, rendered on the server (SSR).
- `app/api/byte/revalidate/route.js`: the webhook Byte calls on Publish, which clears the cache.
- `components/Sections.jsx`: renders the section types Byte's editor offers.

A badge in the bottom-left corner shows where the page came from: **Content from Byte** (green) or **Default content** (orange).

## Run it

```bash
npm install
npm run dev        # http://localhost:3001
```

`.env.local` holds the Site ID, API key and webhook secret from Byte, plus
`BYTE_API_URL` (your local Docker backend at `http://localhost:8001/api/v1/sites`).

## Test the whole flow

1. Open Byte (http://localhost:3000) → **Websites** → **Demo Website**.
2. **Content** tab → click **Hero** → change the heading → **Publish changes**.
3. The toast should say the website was notified. **Overview** shows *Last webhook: Delivered · 200*.
4. Refresh http://localhost:3001: the new heading is there.
5. Try adding or removing a section or a page, or switching the contact form or Cal.com booking on or off in **Lead capture**, then refresh the site.

The webhook URL is `http://host.docker.internal:3001/api/byte/revalidate`, so the Docker backend can reach this site on your computer.

If you generate a new API key or webhook secret in Byte, put it in `.env.local` and restart `npm run dev`.

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import this Bitbucket repo. Vercel detects Next.js; keep the default build settings.
2. Under **Environment Variables**, add `BYTE_SITE_ID`, `BYTE_API_KEY` and `BYTE_WEBHOOK_SECRET` (see `.env.example`). Leave `BYTE_API_URL` unset so the site uses the live Byte API; `localhost` isn't reachable from Vercel.
3. Deploy. In Byte, set the webhook URL to `https://<your-vercel-domain>/api/byte/revalidate`.

Without the variables the site still deploys and shows the default content (orange badge).
