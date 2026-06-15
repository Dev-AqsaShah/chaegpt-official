// Generates branded SVG placeholder images for all menu items.
// Replace files in public/images/ with real photos (same filenames) to upgrade.

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "../public/images");
mkdirSync(outputDir, { recursive: true });

const items = [
  { slug: "doodh-patti", label: "Doodh Patti", emoji: "☕" },
  { slug: "kashmiri-pink-chai", label: "Kashmiri Pink Chai", emoji: "🩷" },
  { slug: "elaichi-chai", label: "Elaichi Chai", emoji: "☕" },
  { slug: "noon-chai", label: "Noon Chai", emoji: "🫖" },
  { slug: "masala-chai", label: "Masala Chai", emoji: "♨️" },
  { slug: "cold-coffee", label: "Cold Coffee", emoji: "☕" },
  { slug: "hot-cappuccino", label: "Cappuccino", emoji: "☕" },
  { slug: "dalgona-coffee", label: "Dalgona Coffee", emoji: "☕" },
  { slug: "oreo-shake", label: "Oreo Shake", emoji: "🥤" },
  { slug: "strawberry-mojito", label: "Strawberry Mojito", emoji: "🍓" },
  { slug: "mango-lassi-shake", label: "Mango Lassi", emoji: "🥭" },
  { slug: "blueberry-mojito", label: "Blueberry Mojito", emoji: "🫐" },
  { slug: "aloo-paratha", label: "Aloo Paratha", emoji: "🫓" },
  { slug: "keema-paratha", label: "Keema Paratha", emoji: "🫓" },
  { slug: "egg-paratha", label: "Egg Paratha", emoji: "🍳" },
  { slug: "zinger-burger", label: "Zinger Burger", emoji: "🍔" },
  { slug: "beef-smash-burger", label: "Smash Burger", emoji: "🍔" },
  { slug: "chicken-shawarma-roll", label: "Shawarma Roll", emoji: "🌯" },
  { slug: "club-sandwich", label: "Club Sandwich", emoji: "🥪" },
  { slug: "paratha-roll", label: "Paratha Roll", emoji: "🌯" },
  { slug: "grilled-veggie-wrap", label: "Veggie Wrap", emoji: "🥙" },
  { slug: "loaded-fries", label: "Loaded Fries", emoji: "🍟" },
  { slug: "garlic-parmesan-fries", label: "Garlic Fries", emoji: "🍟" },
  { slug: "chicken-wings", label: "Chicken Wings", emoji: "🍗" },
  { slug: "chapli-kabab-platter", label: "Chapli Kabab", emoji: "🍢" },
  { slug: "haleem-bowl", label: "Haleem Bowl", emoji: "🍲" },
  { slug: "biryani-box", label: "Biryani Box", emoji: "🍛" },
  { slug: "chocolate-brownie", label: "Brownie", emoji: "🍫" },
  { slug: "gulab-jamun", label: "Gulab Jamun", emoji: "🍬" },
  { slug: "nutella-pancakes", label: "Nutella Pancakes", emoji: "🥞" },
];

function makeSVG(label, emoji) {
  // Red/black gradient branded card
  const lines = label.split(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d0a0a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#C0392B;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#C0392B;stop-opacity:0.05" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="400" fill="url(#bg)" rx="16"/>

  <!-- Card overlay -->
  <rect x="20" y="20" width="360" height="360" fill="url(#card)" rx="12"/>

  <!-- Brand bar at top -->
  <rect x="0" y="0" width="400" height="6" fill="#C0392B" rx="3"/>

  <!-- Emoji -->
  <text x="200" y="185" text-anchor="middle" font-size="90" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${emoji}</text>

  <!-- Item name -->
  ${lines.map((line, i) =>
    `<text x="200" y="${235 + i * 32}" text-anchor="middle" font-size="22" font-weight="bold" font-family="Inter, sans-serif" fill="#F5F0E8">${line}</text>`
  ).join('\n  ')}

  <!-- Brand name -->
  <text x="200" y="375" text-anchor="middle" font-size="13" font-family="Inter, sans-serif" fill="#C0392B" font-weight="600" letter-spacing="2">CHAE GPT</text>
</svg>`;
}

for (const item of items) {
  const svg = makeSVG(item.label, item.emoji);
  const filename = join(outputDir, `${item.slug}.svg`);
  writeFileSync(filename, svg, "utf-8");
  console.log(`✅ ${item.slug}.svg`);
}

console.log(`\n🎨 Generated ${items.length} SVG images in public/images/`);
console.log("Replace any file with a real photo (same filename) to upgrade.");
