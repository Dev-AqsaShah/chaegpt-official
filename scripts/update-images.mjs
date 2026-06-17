/**
 * Updates all menu item images in the database with real Unsplash food photos.
 * Run with: node scripts/update-images.mjs
 */
import Database from "better-sqlite3";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, "../dev.db");
const db = new Database(dbPath);

// Real Unsplash food photos — direct CDN links, stable and cacheable
const imageMap = {
  // ── Signature Chai ────────────────────────────────────────────────────────
  "doodh-patti":
    "https://images.unsplash.com/photo-1556679343-c7306ab8d648?auto=format&fit=crop&w=800&q=80",
  "kashmiri-pink-chai":
    "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80",
  "elaichi-chai":
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
  "noon-chai":
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  "masala-chai":
    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80",

  // ── Hot & Cold Coffee ─────────────────────────────────────────────────────
  "cold-coffee":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
  "hot-cappuccino":
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  "dalgona-coffee":
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80",

  // ── Shakes & Mojitos ──────────────────────────────────────────────────────
  "oreo-shake":
    "https://images.unsplash.com/photo-1553361371-9b0e21d67cdc?auto=format&fit=crop&w=800&q=80",
  "strawberry-mojito":
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
  "mango-lassi-shake":
    "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
  "blueberry-mojito":
    "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?auto=format&fit=crop&w=800&q=80",

  // ── Parathas & Breakfast ──────────────────────────────────────────────────
  "aloo-paratha":
    "https://images.unsplash.com/photo-1565557623262-b51206a2d27f?auto=format&fit=crop&w=800&q=80",
  "keema-paratha":
    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
  "egg-paratha":
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",

  // ── Burgers & Fast Food ───────────────────────────────────────────────────
  "zinger-burger":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  "beef-smash-burger":
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
  "chicken-shawarma-roll":
    "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",

  // ── Sandwiches & Wraps ────────────────────────────────────────────────────
  "club-sandwich":
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
  "paratha-roll":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "grilled-veggie-wrap":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",

  // ── Fries & Snacks ────────────────────────────────────────────────────────
  "loaded-fries":
    "https://images.unsplash.com/photo-1576107232684-1279f66c2c3f?auto=format&fit=crop&w=800&q=80",
  "garlic-parmesan-fries":
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
  "chicken-wings":
    "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80",

  // ── Desi Specials ─────────────────────────────────────────────────────────
  "chapli-kabab-platter":
    "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?auto=format&fit=crop&w=800&q=80",
  "haleem-bowl":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  "biryani-box":
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",

  // ── Desserts ──────────────────────────────────────────────────────────────
  "chocolate-brownie":
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  "gulab-jamun":
    "https://images.unsplash.com/photo-1551024506-0bccd828d834?auto=format&fit=crop&w=800&q=80",
  "nutella-pancakes":
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
};

const stmt = db.prepare("UPDATE MenuItem SET image = ? WHERE slug = ?");
const updateAll = db.transaction(() => {
  let updated = 0;
  for (const [slug, url] of Object.entries(imageMap)) {
    const result = stmt.run(url, slug);
    if (result.changes > 0) {
      console.log(`✅ ${slug}`);
      updated++;
    } else {
      console.log(`⚠️  Not found: ${slug}`);
    }
  }
  return updated;
});

const count = updateAll();
console.log(`\n🎉 Updated ${count} menu item images with Unsplash photos.\n`);
db.close();
