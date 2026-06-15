import { ReservationForm } from "@/components/ReservationForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reservations" };

export default function ReservationsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="font-display text-5xl font-black uppercase text-primary">Book a Table</h1>
        <p className="mt-2 text-muted-foreground">
          Reserve your spot at Chae GPT — perfect for group study sessions or hangouts.
        </p>
      </div>
      <ReservationForm />
    </div>
  );
}
