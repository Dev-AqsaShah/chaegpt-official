# Chae GPT — Cafe Website

A complete full-stack cafe website for **Chae GPT** (ChaiGPT), Jamshoro's boldest chai cafe right opposite Mehran University.

---

## Tech Stack

- **Next.js 16** (App Router, webpack) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui v4**
- **Prisma 7** (SQLite for dev — switch to PostgreSQL for prod)
- **Auth.js v5 (NextAuth)** — email/password + roles: `CUSTOMER` + `ADMIN`
- **Zustand** — cart (persisted to localStorage)
- **Zod** + **React Hook Form** — form validation
- **Framer Motion** — animations
- **better-sqlite3** — SQLite driver adapter for Prisma 7

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate SVG placeholder images
node scripts/generate-images.mjs

# 3. Run database migration  (creates dev.db)
npm run db:migrate

# 4. Seed database with sample data
npm run db:seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Seeded Login Credentials

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@chaegpt.pk       | admin123     |
| Customer | ali@example.com        | customer123  |
| Customer | sara@example.com       | customer123  |

**Promo codes:**
- `WELCOME10` — 10% off on orders ≥ Rs. 300
- `STUDENT50` — flat Rs. 50 off on orders ≥ Rs. 500

---

## Environment Variables

Copy the `.env` file and fill in your values:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-auth-secret"          # generate: openssl rand -base64 32

# Optional — leave empty to use COD/mock-card only
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Optional — leave empty to use seeded sample reviews
GOOGLE_PLACES_API_KEY=""
GOOGLE_PLACE_ID=""
```

Works fully without any external API keys (COD + mock card payment built in).

---

## Replacing Placeholder Images

All menu item images are branded SVG placeholders in `public/images/`.
Replace any file with a real photo using the **same filename**:

```
public/images/kashmiri-pink-chai.svg  →  kashmiri-pink-chai.jpg
```

Then update the `image` extension in the seed file or via Admin Dashboard.

---

## Adding Real Instagram Posts

Edit `src/data/site.ts` and paste post URLs into `featuredPosts`:

```ts
featuredPosts: [
  { platform: "instagram", url: "https://www.instagram.com/p/YOUR_POST_ID/" },
  { platform: "tiktok",    url: "https://www.tiktok.com/@_chaigpt_/video/ID" },
],
```

---

## Enabling Google Reviews

1. Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Find your Place ID at [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
3. Set both in `.env`

---

## Switching to PostgreSQL (Production)

1. Change `DATABASE_URL` to your Postgres connection string
2. Change `provider = "sqlite"` → `provider = "postgresql"` in `prisma/schema.prisma`
3. Update `src/lib/prisma.ts` — remove better-sqlite3 adapter, use direct PrismaClient or `@prisma/adapter-pg`
4. Run `npm run db:migrate`

---

## Admin Dashboard

Visit `/admin` (login: `admin@chaegpt.pk` / `admin123`):
- View today's orders and revenue
- Manage menu items and categories
- Update order statuses
- Confirm or cancel reservations
- Approve or hide customer reviews

---

## Important Notes

- **Turbopack**: The project uses `--webpack` in dev due to a Turbopack initialization issue on Windows with native modules. Turbopack works fine for production builds (`npm run build`).
- **Hours, phone, prices**: All placeholder values — update in `src/data/site.ts` and via the Admin Dashboard.
- **Payment**: COD + mock card work out of the box. JazzCash/Easypaisa hooks are in `src/lib/payment.ts`.
