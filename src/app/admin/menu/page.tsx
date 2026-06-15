import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/payment";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Menu" };
export const revalidate = 0;

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black uppercase">Menu Items</h1>
        <span className="text-muted-foreground text-sm">{items.length} items</span>
      </div>
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-muted/30">
            <tr>
              {["Name", "Category", "Price", "Tags", "Available"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{item.category.name}</td>
                <td className="px-4 py-3 font-semibold text-primary">{formatPKR(item.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.split(",").filter(Boolean).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${item.isAvailable ? "text-green-600" : "text-red-500"}`}>
                    {item.isAvailable ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
