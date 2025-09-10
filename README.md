# Contentful Full‑Stack Demo

### Overview
The purpose of this demo is to show how one can use Next.js internally to serve data from Contentful.

### Features
- Reads content from Contentful and serves it via API routes under /api/instruction. 
- Access to items is filtered by user roles passed via a request header.
- Uses Next.js App Router to render a list of instructions and a single instruction page.
- Rich text rendering is used to display instruction details.

### Stack
- Language: TypeScript
- Framework: Next.js 15 (App Router)
- Render: React 19
- Data: Contentful SDK
- Package manager: pnpm
- Lint/format: Biome

### Requirements
- Node.js 18+ (Next.js 15 requirement)
- pnpm 8+
- Contentful space and API access token

### Environment variables
Create a `.env.local` file in the repository root with the following variables (see `.env.example`):
- `CONTENTFUL_SPACE_ID` – Your Contentful Space ID
- `CONTENTFUL_ACCESS_TOKEN` – Contentful CDA (Content Delivery API) token
- `NEXT_PUBLIC_SITE_URL` – The origin used by server components to call local API endpoints (e.g., http://localhost:3000). In production on Vercel this is set automatically.
- `PORT` – Optional. Port for local dev server (defaults to 3000; if you set this, also update NEXT_PUBLIC_SITE_URL accordingly).

### Notes
- The frontend and API expect a header X-User-Roles with a comma-separated list of roles. 
- Valid roles are defined in src/lib/config/roleMapping.ts: Support, Customer, Tech Advisor.

### Setup
1. Install dependencies
- `pnpm install`

1. Configure env vars
- Copy `.env.example` to `.env.local` and update the variables 

1. Start the app (development)
- `pnpm dev`
- Open http://localhost:3000

### Build
- Build: `pnpm build`

### How it works
- API routes
  - GET /api/instruction
    - Reads X-User-Roles header, maps to tag IDs, fetches matching instruction entries from Contentful, and returns a list.
  - GET /api/instruction/:id
    - Reads X-User-Roles header, verifies access to the requested entry’s tags, and returns item details or 403 if unauthorized.
- UI (App Router)
  - `src/app/page.tsx` lists instructions (calls the API using NEXT_PUBLIC_SITE_URL to reach the local API).
  - `src/app/instruction/[id]/page.tsx` shows a single instruction using rich text rendering.
- Contentful client
  - `src/lib/config/contentfulClient.js` creates the Contentful client from CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN.
- Role mapping
  - `src/lib/config/roleMapping.ts` maps human roles to tag IDs used to filter Contentful entries.

### Project structure (selected)
- `src/app`
  - `api/instruction/route.ts` — GET list endpoint
  - `api/instruction/[id]/route.ts` — GET detail endpoint
  - `page.tsx` — list of instructions (server component)
- `src/lib`
  - `config/contentfulClient.js` — Contentful SDK client
  - `config/roleMapping.ts` — valid roles and tag mapping
  - `controllers/instructionsController.ts` — API business logic and response helpers
  - `types/ContentfulTypes.ts` — TypeScript types for Contentful entries

### Local testing the APIs with curl
- List instructions (roles: Support):
  curl -H "X-User-Roles: Support" http://localhost:3000/api/instruction
- Get one instruction by id:
  curl -H "X-User-Roles: Support" http://localhost:3000/api/instruction/<ID>

### Tests
- No automated tests are present in this repository as of 2025-09-10. TODO: Add unit tests for controllers and integration tests for API routes.

### Development tips
- NEXT_PUBLIC_SITE_URL is used by server components to call the local API. For local dev, set it to your dev origin (e.g., http://localhost:3000). In production, set it to your deployed origin (e.g., https://your-domain.example). If you change the dev port, update both PORT and NEXT_PUBLIC_SITE_URL accordingly.
- Vercel sets NEXT_PUBLIC_SITE_URL automatically.
- Roles and tags must correspond to Contentful entry tags (metadata.tags). Update `roleMapping.ts` to match your space.

### Deployment
- Any platform that supports Next.js 15 (Node 18.18+). Provide env vars and a proper NEXT_PUBLIC_SITE_URL. If deploying behind a custom domain, set NEXT_PUBLIC_SITE_URL to that domain so server components can reach the API.
- TODO: Add platform-specific instructions (e.g., Vercel, Docker) if/when chosen.
