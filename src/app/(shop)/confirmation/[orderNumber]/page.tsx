import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPKR } from "@/lib/payment";
import type { Metadata } from "next";

interface Props { params: Promise<{ orderNumber: string }> }

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function ConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
        <div>
          <h1 className="font-display text-4xl font-black uppercase">Order Placed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order <span className="font-mono font-bold text-primary">{order.orderNumber}</span> is confirmed.
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 text-left space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5 text-primary" /> Order Details
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.nameSnapshot} × {item.quantity}</span>
                <span>{formatPKR(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPKR(order.total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Card (paid)"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href={`/track/${order.orderNumber}`}>Track My Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/menu">Order More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
