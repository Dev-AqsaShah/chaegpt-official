import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { calcDeliveryFee } from "@/lib/payment";

const orderSchema = z.object({
  type: z.enum(["DELIVERY", "PICKUP"]),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
      selectedOptions: z.string().default(""),
    })
  ),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email().optional(),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.enum(["COD", "MOCK_CARD", "STRIPE"]).default("COD"),
  couponCode: z.string().optional(),
  tip: z.number().default(0),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
  }

  const data = parsed.data;

  // Fetch menu items to get current prices
  const menuItemIds = data.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, isAvailable: true },
  });

  if (menuItems.length !== data.items.length) {
    return NextResponse.json({ error: "Some items are unavailable" }, { status: 400 });
  }

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  // Calculate subtotal
  let subtotal = 0;
  const orderItems = data.items.map((item) => {
    const mi = menuItemMap.get(item.menuItemId)!;
    const lineTotal = mi.price * item.quantity;
    subtotal += lineTotal;
    return {
      menuItemId: item.menuItemId,
      nameSnapshot: mi.name,
      unitPrice: mi.price,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      lineTotal,
    };
  });

  // Apply coupon
  let discount = 0;
  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: data.couponCode.toUpperCase(), active: true },
    });
    if (coupon && subtotal >= coupon.minOrder) {
      if (coupon.type === "PERCENTAGE") discount = Math.round(subtotal * coupon.value / 100);
      else discount = coupon.value;
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  const deliveryFee = data.type === "DELIVERY" ? calcDeliveryFee(subtotal) : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee + data.tip;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id ?? null,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestEmail: data.guestEmail,
      status: "PENDING",
      type: data.type,
      subtotal,
      deliveryFee,
      tip: data.tip,
      discount,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "COD" ? "UNPAID" : "PAID",
      couponCode: data.couponCode,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      items: { create: orderItems },
    },
  });

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
