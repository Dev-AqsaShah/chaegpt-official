import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MenuItemDetail } from "@/components/menu/MenuItemDetail";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.menuItem.findUnique({ where: { slug } });
  if (!item) return { title: "Not Found" };
  return { title: item.name, description: item.description ?? undefined };
}

export const revalidate = 60;

export default async function MenuItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await prisma.menuItem.findUnique({
    where: { slug },
    include: { category: true, options: true },
  });

  if (!item || !item.isAvailable) notFound();

  return <MenuItemDetail item={item} />;
}
