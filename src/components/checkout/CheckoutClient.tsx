"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "@/store/cart";
import { formatPKR, calcDeliveryFee, processMockCard } from "@/lib/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tag, Truck, Store } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(7, "Phone required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PAYMENT_METHODS = [
  { id: "COD", label: "Cash on Delivery", desc: "Pay when your order arrives" },
  { id: "MOCK_CARD", label: "Card (Test)", desc: "Simulated card — no real money" },
];

export function CheckoutClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: session?.user?.name ?? "", email: session?.user?.email ?? "" },
  });

  const sub = subtotal();
  const deliveryFee = orderType === "DELIVERY" ? calcDeliveryFee(sub) : 0;
  const total = Math.max(0, sub - discount) + deliveryFee + tip;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-muted-foreground text-lg">Your cart is empty.</p>
        <Button asChild><Link href="/menu">Browse Menu</Link></Button>
      </div>
    );
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setApplying(true);
    const res = await fetch("/api/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal: sub }),
    });
    const data = await res.json();
    setApplying(false);
    if (!res.ok) { toast.error(data.error); return; }
    setDiscount(data.discount);
    toast.success(`Coupon applied! You save ${formatPKR(data.discount)}`);
  }

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      if (paymentMethod === "MOCK_CARD") {
        await processMockCard(total);
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: orderType,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            selectedOptions: JSON.stringify(i.selectedOptions),
          })),
          guestName: formData.name,
          guestPhone: formData.phone,
          guestEmail: formData.email || undefined,
          deliveryAddress: formData.address,
          paymentMethod,
          couponCode: couponCode || undefined,
          tip,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      router.push(`/confirmation/${data.orderNumber}`);
    } catch (err) {
      toast.error((err as Error).message ?? "Order failed. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-black uppercase mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left — forms */}
        <div className="space-y-6">
          {/* Order type */}
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <h2 className="font-semibold">Order Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["DELIVERY", "PICKUP"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                    orderType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {t === "DELIVERY" ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                  {t === "DELIVERY" ? "Delivery" : "Pickup"}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
            <h2 className="font-semibold">Contact Details</h2>
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
            </div>
            <div className="space-y-1.5">
              <Label>Email (optional)</Label>
              <Input {...register("email")} placeholder="you@example.com" />
            </div>
            {orderType === "DELIVERY" && (
              <div className="space-y-1.5">
                <Label>Delivery Address *</Label>
                <Input {...register("address")} placeholder="Street, Area, Jamshoro" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Special Notes (optional)</Label>
              <Input {...register("notes")} placeholder="Less spicy, extra ketchup…" />
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <h2 className="font-semibold">Payment Method</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`w-full flex flex-col items-start gap-0.5 rounded-lg border p-3 text-sm transition-colors ${
                    paymentMethod === pm.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="font-medium">{pm.label}</span>
                  <span className="text-xs text-muted-foreground">{pm.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — summary */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 sticky top-20">
            <h2 className="font-semibold">Order Summary</h2>

            {/* Items */}
            <ul className="space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span>{formatPKR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator />

            {/* Coupon */}
            <div className="flex gap-2">
              <Input
                placeholder="Promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={applyCoupon} disabled={applying}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {discount > 0 && (
              <Badge variant="secondary" className="text-green-600">
                Discount: -{formatPKR(discount)}
              </Badge>
            )}

            {/* Tip */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Add a tip (Rs.)</Label>
              <div className="flex gap-2">
                {[0, 20, 50, 100].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTip(t)}
                    className={`rounded-md border px-3 py-1 text-xs transition-colors ${
                      tip === t ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {t === 0 ? "None" : formatPKR(t)}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPKR(sub)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPKR(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}</span></div>
              {tip > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tip</span><span>{formatPKR(tip)}</span></div>}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPKR(total)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Placing order…" : "Place Order"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
