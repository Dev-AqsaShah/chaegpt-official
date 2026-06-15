"use client";

import Image from "next/image";
import { useState } from "react";
import { Flame, Leaf, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPKR } from "@/lib/payment";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import type { SelectedOption } from "@/types";

interface Option {
  id: string;
  groupName: string;
  label: string;
  priceDelta: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  spiceLevel: number;
  tags: string;
  category: { name: string; emoji: string | null };
  options: Option[];
}

export function MenuItemDetail({ item }: { item: MenuItem }) {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  // Group options by groupName
  const optionGroups = item.options.reduce<Record<string, Option[]>>((acc, opt) => {
    (acc[opt.groupName] ??= []).push(opt);
    return acc;
  }, {});

  function toggleOption(opt: Option) {
    setSelectedOptions((prev) => {
      const alreadySelected = prev.find((o) => o.label === opt.label && o.groupName === opt.groupName);
      if (alreadySelected) {
        return prev.filter((o) => !(o.label === opt.label && o.groupName === opt.groupName));
      }
      // For single-choice groups (like Size, Sugar), replace existing
      const filtered = prev.filter((o) => o.groupName !== opt.groupName);
      return [...filtered, { groupName: opt.groupName, label: opt.label, priceDelta: opt.priceDelta }];
    });
  }

  const optionsTotal = selectedOptions.reduce((s, o) => s + o.priceDelta, 0);
  const totalPrice = (item.price + optionsTotal) * quantity;

  const tags = item.tags.split(",").filter(Boolean);
  const isVeg = tags.includes("veg");

  function handleAddToCart() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image ?? undefined,
      selectedOptions,
      quantity,
    });
    toast.success(`${item.name} added to cart!`);
    openCart();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-8xl">
              {item.category.emoji ?? "☕"}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {item.category.emoji} {item.category.name}
            </p>
            <h1 className="font-display text-3xl font-black uppercase">{item.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              {isVeg && (
                <Badge variant="outline" className="text-green-600 border-green-400 gap-1">
                  <Leaf className="h-3 w-3" /> Veg
                </Badge>
              )}
              {item.spiceLevel > 0 && (
                <Badge variant="outline" className="text-orange-500 border-orange-400 gap-1">
                  <Flame className="h-3 w-3" /> {["", "Mild", "Medium", "Hot"][item.spiceLevel]}
                </Badge>
              )}
            </div>
          </div>

          {item.description && (
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          )}

          <Separator />

          {/* Options */}
          {Object.entries(optionGroups).map(([group, opts]) => (
            <div key={group}>
              <p className="mb-2 text-sm font-semibold">{group}</p>
              <div className="flex flex-wrap gap-2">
                {opts.map((opt) => {
                  const selected = selectedOptions.some(
                    (o) => o.label === opt.label && o.groupName === opt.groupName
                  );
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(opt)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {opt.label}
                      {opt.priceDelta > 0 && (
                        <span className="ml-1 opacity-70">+{opt.priceDelta}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <Separator />

          {/* Quantity + Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="font-display text-2xl font-black text-primary">
              {formatPKR(totalPrice)}
            </span>
          </div>

          <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
