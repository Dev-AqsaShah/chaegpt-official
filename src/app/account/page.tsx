import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { formatPKR } from "@/lib/payment";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-600",
  CONFIRMED: "bg-blue-500/20 text-blue-600",
  PREPARING: "bg-orange-500/20 text-orange-600",
  OUT_FOR_DELIVERY: "bg-purple-500/20 text-purple-600",
  DELIVERED: "bg-green-500/20 text-green-600",
  CANCELLED: "bg-red-500/20 text-red-600",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-black uppercase">My Orders</h1>
        <p className="mt-1 text-muted-foreground">Welcome, {session?.user?.name ?? "friend"}!</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No orders yet.</p>
          <Link href="/menu" className="text-primary hover:underline mt-2 block">Browse the menu →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="font-mono font-bold text-sm text-primary">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                    {order.status.replace("_", " ")}
                  </span>
                  <span className="font-bold text-sm">{formatPKR(order.total)}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {order.items.map((i) => `${i.nameSnapshot} ×${i.quantity}`).join(" · ")}
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/track/${order.orderNumber}`}
                  className="text-xs text-primary hover:underline"
                >
                  Track order →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
