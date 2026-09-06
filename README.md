# Docly – Markdown Knowledge Base

## Overview
Docly is a personal knowledge‑base web app built with **Next.js 16**, **Prisma SQLite**, and **Tiptap**. It lets you:
- Sign‑up / login (admin‑seeded, JWT cookie auth)
- Create, upload, rename, delete Markdown files
- Edit files with a full‑featured Tiptap editor (headings, tables, task lists, code blocks, ✅ RTL/Farsi support, text‑align toggle)
- Auto‑save (1.5 s debounce) + manual save
- View a beautiful read‑only page (`/doc/:slug`)
- Serve raw Markdown for AI (`/doc/:slug/raw` – `text/markdown`)
- Manage users (admin can create/reset passwords, delete)
- Multi‑file drag‑and‑drop upload

## Tech Stack
- **Next.js 16** (App Router, Turbopack) – React 19
- **Prisma 5** + **SQLite** – persistence
- **Tiptap** extensions (StarterKit, Table, TaskList, TextAlign, Highlight, CodeBlock‑Lowlight)
- **Tailwind 4** + shadcn UI utilities
- **bcrypt** – password hashing
- **jsonwebtoken** – JWT auth token

## Prerequisites
- Node 20+ (tested on 20.14)
- npm 9+ (or pnpm / Yarn)

## Setup
```bash
# clone repo
git clone https://github.com/yourname/docly.git
cd docly

# install deps (legacy-peer‑deps needed for some packages)
npm install --legacy-peer-deps

# create .env (or edit generated one)
cp .env.example .env
# set a strong ADMIN_PASSWORD and optionally ADMIN_EMAIL

# seed admin (runs automatically on first start)
# admin@docly.local / admin123 (change via .env)

# run dev server
npm run dev
# Open http://localhost:3000 (or 3001 if 3000 busy)
```
The dev server supports hot‑reloading. The first request creates the SQLite `dev.db` and the admin user.

## Build / Production
```bash
npm run build   # creates .next production build
npm start       # runs the compiled server
```
You can also export a static site (no auth) – not covered here.

## Scripts
- `npm run dev` – dev mode
- `npm run build` – production build
- `npm run start` – start prod server
- `npm run lint` – eslint (configured for Next.js)
- `npm run typecheck` – TypeScript check

## Folder Overview
```
app/                 # Next.js route handlers & pages
  (app)/files/…      # file manager UI
  (app)/edit/[id]/   # editor page
  (app)/users/       # admin user management UI
  (app)/settings/    # password change UI
  api/…               # REST endpoints (auth, docs, users)
components/          # React components (FileList, TiptapEditor, …)
lib/                 # prisma client, auth helpers, utils
prisma/              # schema.prisma, migrations, seed script
app/globals.css      # Tailwind + prose & table RTL styles
```

## Authentication Flow
1. POST `/api/auth/login` – returns JWT in `auth` cookie.
2. Middleware protects `/files`, `/edit`, `/users`.
3. Logout button clears cookie and redirects to `/login`.

## Editing Markdown
- Toolbar provides bold/italic/heading/list/task‑list/blockquote/code‑block/table.
- Text‑align buttons (`left/center/right/justify`) toggle `dir` on the editor – perfect for Persian/Farsi.
- RTL is the default (`dir="rtl"`), switch with the **RTL/LTR** toggle.
- Auto‑save fires after 1.5 s of inactivity, status shown (`Saving…/Saved`).
- Manual **Save** button forces immediate persist.

## Multi‑File Upload
Drag files onto the file‑list area or use the **Upload** button (supports multiple `.md`/`.markdown`).

## Password Management
- Users can change own password at `/settings` (requires current password).
- Admin can reset any user’s password via **Reset PW** button on the Users page.

## Contributing
- Fork the repo, create a feature branch, and submit a PR.
- Follow existing code style (no extra comments unless requested).
- Run `npm run lint && npm run typecheck` before pushing.

## License
MIT – feel free to adapt for your portfolio.

---
**Enjoy building your knowledge base!**
