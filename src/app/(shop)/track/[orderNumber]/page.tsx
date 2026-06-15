import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderTracker } from "@/components/checkout/OrderTracker";
import type { Metadata } from "next";

interface Props { params: Promise<{ orderNumber: string }> }

export const metadata: Metadata = { title: "Track Order" };

export default async function TrackPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-black uppercase mb-2">Order Tracking</h1>
      <p className="text-muted-foreground mb-8">
        Order <span className="font-mono text-primary">{order.orderNumber}</span>
      </p>
      <OrderTracker status={order.status as string} type={order.type as string} />
    </div>
  );
}
