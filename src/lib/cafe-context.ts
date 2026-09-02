import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/payment";
import { siteConfig } from "@/data/site";

export async function getCafeContext(): Promise<string> {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: { options: true },
      },
    },
  });

  const menuText = categories
    .map((category) => {
      const items = category.items
        .map((item) => {
          const status = item.isAvailable ? "available" : "CURRENTLY UNAVAILABLE";
          const spice = item.spiceLevel > 0 ? `, spice ${item.spiceLevel}/5` : "";
          const tags = item.tags ? `, tags: ${item.tags}` : "";
          const desc = item.description ? ` — ${item.description}` : "";
          const options = item.options.length
            ? ` Add-ons: ${item.options
                .map((o) => `${o.label} (${o.priceDelta >= 0 ? "+" : ""}${formatPKR(o.priceDelta)})`)
                .join(", ")}.`
            : "";
          return `  - ${item.name}: ${formatPKR(item.price)} [${status}${spice}${tags}]${desc}${options}`;
        })
        .join("\n");
      return `${category.emoji ?? ""} ${category.name}\n${items || "  (no items listed yet)"}`;
    })
    .join("\n\n");

  const hours = siteConfig.hours.map((h) => `${h.day}: ${h.time}`).join("; ");

  return `Cafe name: ${siteConfig.name} — "${siteConfig.tagline}"
About: ${siteConfig.description}

Address: ${siteConfig.contact.address}
Phone: ${siteConfig.contact.phone}
Email: ${siteConfig.contact.email}
Hours: ${hours}
Services offered: ${siteConfig.services.join(", ")}
Social: Instagram @${siteConfig.social.instagram} (${siteConfig.social.instagramUrl}), TikTok @${siteConfig.social.tiktok}, Facebook @${siteConfig.social.facebook}

Full menu (prices in PKR, availability marked per item):
${menuText || "(menu not loaded yet)"}`;
}
