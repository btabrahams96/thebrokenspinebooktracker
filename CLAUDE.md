# The Broken Spine Library — Project Guide for Claude Code

A personal PWA for tracking books, manga, and comics. Single user (Bryton). No social features. Built to be installed on a phone and stay out of the way.

The full spec lives in `SPEC.html` at the repo root. Read it before any non-trivial change. Note: the spec was written from a template branded "Stacks"; this project is rebranded **The Broken Spine Library** (display name: **The Broken Spine**). Treat the spec as architectural truth, not a copy source for branding.

---

## Stack (locked — do not change without asking)

- **Frontend:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS with custom theme tokens (below)
- **Routing:** React Router v6
- **PWA:** vite-plugin-pwa
- **Scanning:** @zxing/browser
- **Hosting:** Cloudflare Pages (frontend) + Cloudflare Worker (API)
- **Database:** Cloudflare D1 (SQLite at the edge)
- **Auth:** PIN cookie (HttpOnly, set by Worker, single-user)

---

## Design Tokens

Apply via `tailwind.config.js` `theme.extend`. Use the named tokens, never raw hex in components.

```js
colors: {
  paper:        '#F2E8D5',  // base background
  'paper-light':'#FAF3E3',  // cards, elevated surfaces
  'paper-deep': '#E8DCC4',  // chips, inputs
  burgundy:     '#6B1F2E',  // primary action color
  'burgundy-deep': '#4F1622',
  'burgundy-light':'#8B2E3F',
  forest:       '#2D4A3E',  // status indicators (reading, completed)
  'forest-deep':'#1F3329',
  'forest-light':'#3F6253',
  ink:          '#1A1410',  // primary text
  sepia:        '#8B7456',  // muted text, secondary
  'sepia-light':'#B5A082',  // disabled, placeholders
  line:         'rgba(26, 20, 16, 0.12)',
  'line-soft':  'rgba(26, 20, 16, 0.06)',
}
```

### Typography

```js
fontFamily: {
  display: ['Fraunces', 'serif'],
  sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
  mono:    ['"JetBrains Mono"', 'monospace'],
}
```

Fraunces should use optical sizing. For large display text, set `font-variation-settings: 'opsz' 144, 'SOFT' 100`.

### Spacing & Radii

- Default radius: `rounded-md` (6px)
- Cards: `rounded-lg` (8px)
- Phone-style modals/drawers: `rounded-2xl`
- Generous padding on cards (`p-6`/`p-7`), tight on chips (`px-3 py-1`)

---

## Data Model

One table, `items`. Definition lives in `db/schema.sql`:

```sql
CREATE TABLE items (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  creator       TEXT,
  cover_url     TEXT,
  type          TEXT NOT NULL CHECK(type IN ('book','manga','comic')),
  isbn          TEXT,
  external_id   TEXT,
  source        TEXT,
  status        TEXT NOT NULL CHECK(status IN ('wishlist','owned','reading','read','dnf')),
  rating        INTEGER CHECK(rating BETWEEN 1 AND 5),
  notes         TEXT,
  series        TEXT,
  volume        INTEGER,
  date_added    TEXT NOT NULL DEFAULT (datetime('now')),
  date_finished TEXT
);
```

TypeScript type lives in `src/types.ts` and mirrors the schema.

---

## API Strategy

All metadata lookups happen client-side. The Worker only handles save/list/update against D1.

### Lookup chain (in `src/lib/lookup.ts`)

1. **Google Books** — `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}` — primary for books.
2. **Open Library** — `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data` — fallback.
3. **AniList GraphQL** — `https://graphql.anilist.co` — used for manga.
4. **ComicVine** — `https://comicvine.gamespot.com/api/` — comics; needs `VITE_COMICVINE_KEY`.
5. **Manual entry** — always available as a fallback.

### Worker API (in `worker/src/index.ts`)

All routes require the `tbs-pin` cookie (set by `POST /auth` with the correct PIN).

- `GET /items?status=...&type=...`
- `GET /items/:id`
- `POST /items`
- `PATCH /items/:id`
- `DELETE /items/:id`
- `GET /stats`

---

## Conventions

- **Components:** PascalCase, default export, one per file.
- **Hooks:** `useX`, in `src/hooks/`, one per file.
- **API client:** all fetch calls go through `src/lib/api.ts` — never call `fetch` from a component.
- **No raw colors in JSX.** Use Tailwind tokens.
- **No mock data in production code.** Loading states use skeletons; empty states use real components.
- **Mobile-first.** iPhone width (375px) first. Bottom nav is sticky on mobile; on desktop (≥768px) it becomes a left sidebar.
- **Type safely.** No `any`.

---

## What NOT to add (scope lock)

Single-user personal tracker. Out of scope:

- ❌ User accounts, signup, multi-tenant anything
- ❌ Social features
- ❌ Recommendation algorithms
- ❌ Reading goals or yearly challenges
- ❌ Push notifications / email digests
- ❌ Importing from Goodreads/StoryGraph (revisit later)
- ❌ Tags or categories beyond `type` and `status`
- ❌ Multiple libraries / shelves

If a feature feels valuable but is on this list, surface it as a question, don't build it.

---

## Build Phases (from SPEC.html § 07)

1. **Shell** — navigable empty app, design tokens wired, deployed to Cloudflare Pages
2. **Discovery** — scan + search via the lookup chain, result preview
3. **Storage** — D1 + Worker + PIN auth, Library/Wishlist on real data, Detail edits
4. **Polish** — filters, stats, offline service worker, install prompt, empty states

---

## Useful commands

```bash
npm run dev                  # Vite dev server
npm run build                # Production build
npx wrangler dev worker/     # Worker locally (Phase 03+)

# database (Phase 03+)
npx wrangler d1 create thebrokenspine
npx wrangler d1 execute thebrokenspine --file=db/schema.sql
```

---

## Tone for any user-facing copy

Plain, slightly literary, never marketing-y. Write the way a librarian would.

- ✅ "Aim at the barcode"  ❌ "Scan with the magic of computer vision!"
- ✅ "Nothing here yet. Scan something."  ❌ "Your epic reading journey starts now! 📚✨"
- ✅ "Couldn't find that one. Add it manually?"  ❌ "Oops! Something went wrong."
