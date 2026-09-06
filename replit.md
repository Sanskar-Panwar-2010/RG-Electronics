# R G Electronics

Responsive marketing and catalogue site for R G Electronics, a New Delhi provider of electronic security and communications infrastructure.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rg-electronics/src/App.tsx` — routes, catalogue data, shared shell, and page UI
- `artifacts/rg-electronics/src/index.css` — typography, focus treatment, motion, and global visual tokens
- `artifacts/rg-electronics/public/images/` — generated infrastructure photography used by the marketing pages
- `artifacts/rg-electronics/index.html` — document metadata and social preview defaults

## Architecture decisions

- The first MVP is frontend-only: the enquiry form validates locally and shows success/error feedback without sending customer data to a third-party service.
- Product catalogue content is local and intentionally small; each product detail route is driven from the same catalogue records used by search and featured systems.
- The visual system uses photography-led light/dark canvases and Action Blue as the only interaction accent, with no decorative gradients or UI shadows.
- Wouter keeps routing prefix-aware through the artifact base path so the same app works in preview and deployment.

## Product

- Home, About, Systems catalogue, product detail, and Contact pages
- Client-side product search and category filtering
- Product enquiry CTAs that prefill the contact form subject
- Accessible responsive navigation, focus states, skip link, reduced-motion support, and New Delhi service-area map
- Contact form validation with inline errors, first-error focus, and live success/error feedback

## User preferences

- Use the attached Apple-inspired design direction as the visual source of truth while adapting it for a high-trust infrastructure company.

## Gotchas

- The app uses generated/local images in `public/images`; keep image paths rooted so Vite serves them through the artifact preview path.
- If live lead delivery is added later, connect the current form submission to an approved email/CRM integration rather than adding credentials to the frontend.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
