"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-500/20",
  CONFIRMED: "text-blue-600 bg-blue-500/20",
  PREPARING: "text-orange-600 bg-orange-500/20",
  OUT_FOR_DELIVERY: "text-purple-600 bg-purple-500/20",
  DELIVERED: "text-green-600 bg-green-500/20",
  CANCELLED: "text-red-600 bg-red-500/20",
};

export function AdminOrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    if (!res.ok) { toast.error("Update failed"); return; }
    setStatus(newStatus);
    toast.success("Status updated");
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      disabled={loading}
      className={`text-xs rounded-full px-2.5 py-1 border-0 font-medium cursor-pointer ${statusColors[status] ?? ""}`}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-background text-foreground">
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
