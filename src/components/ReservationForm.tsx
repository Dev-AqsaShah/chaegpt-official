"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(7, "Phone required"),
  email: z.string().email().optional().or(z.literal("")),
  date: z.string().min(1, "Date required"),
  time: z.string().min(1, "Time required"),
  partySize: z.number().min(1).max(20),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ReservationForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2 },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, partySize: Number(data.partySize) }),
    });
    setLoading(false);
    if (!res.ok) { toast.error("Booking failed. Try again."); return; }
    setDone(true);
    toast.success("Reservation request sent!");
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-8 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-black uppercase">You&apos;re booked!</h2>
        <p className="text-muted-foreground">
          We&apos;ll confirm your reservation via phone shortly. See you at Chae GPT!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-border/50 bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Name *</Label>
          <Input {...register("name")} placeholder="Ali Hassan" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Phone *</Label>
          <Input {...register("phone")} placeholder="0300-0000000" />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input type="date" {...register("date")} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Time *</Label>
          <Input type="time" {...register("time")} />
          {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Party Size *</Label>
          <Input type="number" min={1} max={20} {...register("partySize", { valueAsNumber: true })} />
          {errors.partySize && <p className="text-xs text-destructive">{errors.partySize.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Email (optional)</Label>
          <Input type="email" {...register("email")} placeholder="you@example.com" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Special Requests</Label>
        <Input {...register("notes")} placeholder="Outdoor seating, birthday cake, etc." />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Booking…" : "Request Reservation"}
      </Button>
    </form>
  );
}
