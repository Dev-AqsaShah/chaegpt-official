import { prisma } from "@/lib/prisma";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Menu" };
export const revalidate = 60;

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        options: true,
      },
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return <MenuPageClient categories={categories} items={items} />;
}
