import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Reservations" };
export const revalidate = 0;

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-600",
    CONFIRMED: "text-green-600",
    CANCELLED: "text-red-500",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black uppercase">Reservations</h1>
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-muted/30">
            <tr>
              {["Name", "Phone", "Date", "Time", "Party", "Notes", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-xs">{r.phone}</td>
                <td className="px-4 py-3 text-xs">{r.date}</td>
                <td className="px-4 py-3 text-xs">{r.time}</td>
                <td className="px-4 py-3 text-center">{r.partySize}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.notes ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${statusColors[r.status] ?? ""}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">No reservations yet.</p>
        )}
      </div>
    </div>
  );
}
