

# Claude Code Prompt — "Chae GPT" Cafe Website (Jamshoro)

> Paste everything below the line into Claude Code as your first message.
> This is for the real Chae GPT (ChaiGPT) chai cafe in Jamshoro.

---

You are building a complete, production-quality website from scratch for a real chai cafe in Jamshoro, Sindh, Pakistan. Build it incrementally, phase by phase, and after each phase make sure the app still runs with no errors before moving on. Make sensible default decisions on your own instead of stopping to ask me — list any assumptions in the README.

## 1. Business Brief (real details)

- **Name:** Chae GPT (also written ChaiGPT) — a trendy chai cafe.
- **Tagline idea:** "Where Jamshoro sips & studies." (Use it or improve it.)
- **Location:** Plot A-306, Jamshoro Society Phase 3, Near The City School, **Opposite Mehran University, Jamshoro, Sindh, Pakistan.**
- **Crowd & vibe:** University students (Mehran University is right across the road) + young families. Energetic, hangout cafe with **dine-in, outdoor seating, and delivery**. Open all day.
- **Brand aesthetic:** Bold **red + black + charcoal** with cream accents — a high-energy, modern cafe look. NOTE: the cafe has a "heist"-style mood, but do **not** use any copyrighted movie/TV characters, logos, masks, or stills. Capture the energy with original red/black design only.
- **Currency:** **PKR (Rs.)**, student-friendly pricing. Pakistani phone/address/date formats.
- **Goal:** A full-stack site where customers browse the menu, order for delivery/pickup with payment, track the order, book a table for groups, see the cafe's real social feed, and read/leave reviews — plus an admin dashboard to manage everything. It must feel like Chae GPT's real brand, not a template.

## 2. Real Contact & Social (put in `src/data/site.ts`)

- Address: Plot A-306, Jamshoro Society Phase 3, Near The City School, Opposite Mehran University, Jamshoro
- Email: chaigptofficial@gmail.com
- Instagram: @chaigpt__  ·  TikTok: @_chaigpt_  ·  Facebook: chaigptofficial
- Hours: Open daily (use placeholder times like 11:00 AM – 2:00 AM; flag as "confirm with owner")
- Services: Dine-in · Outdoor seating · Delivery · Takeaway

## 3. Tech Stack (use exactly this)

- **Next.js 14+** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Prisma ORM** with **SQLite** for dev (zero setup), structured to switch to **PostgreSQL** via env var only
- **Auth.js (NextAuth v5)** — email/password, roles `customer` + `admin`
- **Zustand** for cart (persisted to localStorage)
- **Zod** + **React Hook Form** for forms
- **Framer Motion** for subtle animations
- **next/image** for images
- **Stripe (test mode)** behind a `PaymentProvider` interface. Ship with **Cash on Delivery (COD)** + a **mock-card option that works with no real keys** so the flow is testable out of the box. Stripe activates only if keys exist in `.env`. Leave clear TODO hooks for a local gateway (JazzCash/Easypaisa).

## 4. Design Direction

- Bold, youthful, energetic cafe look. **Red primary**, near-black/charcoal sections, cream surfaces, one neutral accent. Define as CSS variables / Tailwind theme tokens.
- Display font with personality for headings + clean sans for body (via `next/font`).
- Big appetizing imagery, smooth hovers, soft shadows, rounded corners. Fully **responsive (mobile-first)**, accessible, with a clean **light/dark toggle** (dark should feel like the default given the brand).

## 5. Features

**Public site**
- Landing: sticky navbar, hero with CTA ("Order now" / "Visit us"), signature drinks strip, about/story (student cafe opposite Mehran University), photo gallery, **live social feed section**, reviews, hours, location + embedded map, footer.
- **Menu page:** items grouped by category — *Signature Chai, Hot & Cold Coffee, Shakes & Mojitos, Parathas & Breakfast, Burgers & Fast Food, Sandwiches & Wraps, Fries & Snacks, Desi Specials, Desserts.* Category filter, search, veg/spicy tags, price in Rs. Each item: image, name, short description, price, "Add to cart." (Owner can edit exact items later via admin.)
- **Item detail page:** image, description, customizations (size, sugar level for chai, add-ons), quantity, add to cart.
- **Reservations:** group/table booking form (name, phone, date, time, party size) saved to DB.
- **Contact** page with a working form.

**Ordering**
- Slide-in **cart drawer**: edit quantity, remove, subtotal.
- **Checkout:** delivery vs pickup toggle, address + contact, payment method (COD / mock card / Stripe if configured), promo code, tip, delivery fee, order summary.
- Order confirmation with an order number.
- **Order tracking:** Pending → Confirmed → Preparing → Out for delivery → Delivered.

**Accounts**
- Sign up / sign in / sign out, profile, saved addresses, **order history** with status.

**Admin dashboard** (admin role only, protected)
- Stats: orders today, revenue, top items (simple chart).
- Menu CRUD (categories + items, toggle availability, set/replace image).
- Orders: list, detail, update status.
- Reservations: view + confirm/cancel.
- Reviews: approve / hide.

## 6. Social Feed & Reviews — do it the legal, reliable way

The owner wants the cafe's real TikTok/Instagram content and Google reviews on the site. Do **not** scrape TikTok, Instagram, or Google — it breaks their terms, is unreliable, and the media is copyrighted. Build it so real content plugs in legitimately:

- **Social feed section:** use the **official Instagram & TikTok embed (oEmbed) widgets**, reading the handles from `src/data/site.ts` (@chaigpt__, @_chaigpt_). Show a few placeholder embed cards until specific post URLs are added. Add a clearly commented array `featuredPosts` where the owner pastes real post/reel URLs.
- **Video:** an embed-by-ID component for YouTube if they add a channel later.
- **Reviews:** make the reviews component optionally pull live ratings from the **Google Places API** if `GOOGLE_PLACES_API_KEY` + place ID are in `.env`; otherwise show seeded sample reviews. Never copy review text verbatim from the web.
- Document all of this in the README so the owner can paste real handles / post URLs / place ID.

## 7. Data Model (Prisma)

`User` (id, name, email, hashedPassword, role, addresses, orders, reviews), `Address`, `Category`, `MenuItem` (name, slug, description, price, image, categoryId, spiceLevel, tags, isAvailable, options), `MenuItemOption` (size/sugar/add-on with priceDelta), `Order` (orderNumber, userId, status, type[delivery|pickup], subtotal, deliveryFee, tip, total, paymentMethod, paymentStatus, address, items), `OrderItem` (menuItemId, name snapshot, unitPrice, quantity, selectedOptions), `Reservation`, `Review` (rating, comment, userId, approved), `Coupon` (code, type, value, active).

## 8. Folder Structure

```
chaegpt/
├─ prisma/            # schema.prisma, seed.ts
├─ public/images/     # generated placeholder images
├─ src/
│  ├─ app/
│  │  ├─ (public)/    # landing, menu, item, reservations, contact
│  │  ├─ (shop)/      # cart, checkout, confirmation, tracking
│  │  ├─ (auth)/      # login, register
│  │  ├─ account/     # profile, addresses, order history
│  │  ├─ admin/       # dashboard, menu, orders, reservations, reviews
│  │  ├─ api/         # route handlers
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ components/     # ui/, layout/, menu/, cart/, admin/, social/
│  ├─ lib/            # prisma, auth, payment provider, utils
│  ├─ store/          # zustand cart
│  ├─ types/
│  └─ data/           # site.ts (contact + socials), nav, hours
├─ .env.example
├─ README.md
└─ package.json
```

Add a short note at the top of each major folder explaining what lives there.

## 9. Content & Images

The site must look **full and real immediately** after seeding — no empty pages, no broken images.

- Write a **rich seed script** (`prisma/seed.ts`): 1 admin + 2 customers, the 9 categories above, **~30 realistic cafe items** (e.g. Doodh Patti, Kashmiri Pink Chai, Elaichi Chai, Cold Coffee, Oreo Shake, Aloo Paratha, Zinger Burger, Club Sandwich, Loaded Fries, Paratha Roll, Brownie, etc.) with tasteful descriptions and student-friendly PKR prices; several sample reviews; a couple of sample orders; a working promo code `WELCOME10`.
- **Images:** Do NOT scrape copyrighted photos. **Generate attractive branded SVG placeholders** for each item (red/black gradient + item name + small icon) saved to `public/images/` with predictable filenames (e.g. `kashmiri-chai.svg`). In the README, explain how to swap in real royalty-free photos or the cafe's own photos by replacing files with the same name.

## 10. Build Plan (in order; verify each works)

1. Scaffold + Tailwind + shadcn/ui + fonts + red/black theme tokens + dark mode.
2. Prisma schema + SQLite + seed (run it, confirm data).
3. Layout, navbar, footer, full landing page.
4. Menu listing + filter/search + item detail + cart drawer + cart store.
5. Checkout + PaymentProvider + COD/mock-card + order creation + confirmation + tracking.
6. Auth + account pages + order history.
7. Admin dashboard.
8. Reservations + contact + social/reviews sections + animations + responsive polish + accessibility.

## 11. Definition of Done

- Fresh clone → `npm install` → `npm run db:seed` → `npm run dev` shows a fully populated, good-looking site.
- A clear **README.md**: overview, stack, setup steps, env vars, **seeded admin email/password**, how to swap placeholder images for real photos, how to plug in the real Instagram/TikTok post URLs + Google Places reviews, and your list of assumptions.
- **`.env.example`** committed (no real secrets). Works without any external keys.
- Responsive on mobile + desktop, light/dark both clean, no console errors, no broken images or dead links, TypeScript strict, well-organized commented code.

Start Phase 1 now and continue through all phases.
