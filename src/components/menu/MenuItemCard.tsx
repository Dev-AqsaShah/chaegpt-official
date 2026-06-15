"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, Plus, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/payment";
import { useCart } from "@/store/cart";

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  spiceLevel: number;
  tags: string;
  options: { id: string; groupName: string; label: string; priceDelta: number }[];
}

const spiceLabels = ["", "Mild", "Medium", "Hot 🔥"];

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem, openCart } = useCart();
  const tags = item.tags.split(",").filter(Boolean);
  const isVeg = tags.includes("veg");
  const isNew = tags.includes("new");
  const isPopular = tags.includes("popular");
  const hasOptions = item.options.length > 0;

  function handleQuickAdd() {
    if (hasOptions) return; // redirect to detail page
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image ?? undefined,
      selectedOptions: [],
    });
    toast.success(`${item.name} added!`);
    openCart();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/40 transition-all hover:shadow-lg"
    >
      {/* Image */}
      <Link href={`/menu/${item.slug}`} className="relative aspect-[4/3] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-5xl">
            ☕
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {isNew && <Badge className="bg-primary text-xs">New</Badge>}
          {isPopular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
        </div>
        {isVeg && (
          <div className="absolute top-2 right-2">
            <Leaf className="h-4 w-4 text-green-500" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 gap-2">
        <Link href={`/menu/${item.slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
        </Link>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        {item.spiceLevel > 0 && (
          <span className="flex items-center gap-1 text-xs text-orange-500">
            <Flame className="h-3 w-3" /> {spiceLabels[item.spiceLevel]}
          </span>
        )}
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-bold text-primary">{formatPKR(item.price)}</span>
          {hasOptions ? (
            <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
              <Link href={`/menu/${item.slug}`}>Customize</Link>
            </Button>
          ) : (
            <Button size="sm" className="h-8 text-xs gap-1" onClick={handleQuickAdd}>
              <Plus className="h-3 w-3" /> Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
