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

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function MenuItemCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const { addItem, openCart } = useCart();
  const tags = item.tags.split(",").filter(Boolean);
  const isVeg = tags.includes("veg");
  const isNew = tags.includes("new");
  const isPopular = tags.includes("popular");
  const hasOptions = item.options.length > 0;

  function handleQuickAdd() {
    if (hasOptions) return;
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
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/40 transition-colors hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Image */}
      <Link href={`/menu/${item.slug}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-5xl">
            ☕
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {isNew && (
            <Badge className="bg-primary text-[10px] px-1.5 py-0.5 shadow-sm">New</Badge>
          )}
          {isPopular && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 shadow-sm">
              🔥 Popular
            </Badge>
          )}
        </div>
        {isVeg && (
          <div className="absolute top-2 right-2 rounded-full bg-green-500/20 backdrop-blur-sm p-1">
            <Leaf className="h-3 w-3 text-green-500" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 gap-1.5">
        <Link href={`/menu/${item.slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{item.name}</h3>
        </Link>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        {item.spiceLevel > 0 && (
          <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
            <Flame className="h-3 w-3" /> {spiceLabels[item.spiceLevel]}
          </span>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/40">
          <span className="font-bold text-primary text-sm">{formatPKR(item.price)}</span>
          {hasOptions ? (
            <Button size="sm" variant="outline" className="h-7 text-xs px-2.5" asChild>
              <Link href={`/menu/${item.slug}`}>Customize</Link>
            </Button>
          ) : (
            <Button size="sm" className="h-7 text-xs gap-1 px-2.5" onClick={handleQuickAdd}>
              <Plus className="h-3 w-3" /> Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
