import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/payment";
import { formatDate } from "@/lib/utils";
import { ShoppingBag, TrendingUp, Users, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, totalOrders, totalUsers, pendingReviews, recentOrders] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.review.count({ where: { approved: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: true },
    }),
  ]);

  const revenueToday = await prisma.order.aggregate({
    _sum: { total: true },
    where: { createdAt: { gte: today }, status: { not: "CANCELLED" } },
  });

  const stats = [
    { label: "Orders Today", value: ordersToday, icon: ShoppingBag, color: "text-primary" },
    { label: "Revenue Today", value: formatPKR(revenueToday._sum.total ?? 0), icon: TrendingUp, color: "text-green-500" },
    { label: "Total Customers", value: totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Pending Reviews", value: pendingReviews, icon: Star, color: "text-yellow-500" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-600 bg-yellow-500/20",
    CONFIRMED: "text-blue-600 bg-blue-500/20",
    PREPARING: "text-orange-600 bg-orange-500/20",
    OUT_FOR_DELIVERY: "text-purple-600 bg-purple-500/20",
    DELIVERED: "text-green-600 bg-green-500/20",
    CANCELLED: "text-red-600 bg-red-500/20",
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-black uppercase">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="font-display text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                {["Order #", "Date", "Items", "Total", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-primary font-bold">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.items.length} item(s)</td>
                  <td className="px-4 py-3 font-semibold">{formatPKR(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
