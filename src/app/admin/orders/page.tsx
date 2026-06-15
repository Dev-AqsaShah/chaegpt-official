import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/payment";
import { formatDate } from "@/lib/utils";
import { AdminOrderActions } from "@/components/admin/AdminOrderActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Orders" };
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black uppercase">Orders</h1>
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-muted/30">
            <tr>
              {["Order #", "Customer", "Date", "Total", "Type", "Payment", "Status", "Actions"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/20">
                <td className="px-3 py-3 font-mono text-primary text-xs">{order.orderNumber}</td>
                <td className="px-3 py-3 text-xs">{order.guestName ?? "User"}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                <td className="px-3 py-3 font-semibold text-xs">{formatPKR(order.total)}</td>
                <td className="px-3 py-3 text-xs">{order.type}</td>
                <td className="px-3 py-3 text-xs">{order.paymentMethod}</td>
                <td className="px-3 py-3">
                  <AdminOrderActions orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
