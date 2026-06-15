import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase(), active: true },
  });

  if (!coupon) return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon has expired" }, { status: 410 });
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 410 });
  }
  if (subtotal < coupon.minOrder) {
    return NextResponse.json(
      { error: `Minimum order Rs. ${coupon.minOrder} required` },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.round(subtotal * coupon.value / 100)
      : coupon.value;

  return NextResponse.json({ discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } });
}
