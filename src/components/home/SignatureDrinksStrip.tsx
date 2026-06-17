"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPKR } from "@/lib/payment";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  description: string | null;
}

export function SignatureDrinksStrip({ items }: { items: MenuItem[] }) {
  const { addItem, openCart } = useCart();

  function handleAdd(item: MenuItem) {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image ?? undefined,
      selectedOptions: [],
    });
    toast.success(`${item.name} added to cart`);
    openCart();
  }

  return (
    <section className="py-16 bg-card">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl font-black uppercase text-primary">
              Popular Picks
            </h2>
            <p className="mt-1 text-muted-foreground">
              The items Mehran students can't get enough of.
            </p>
          </div>
          <Link href="/menu" className="text-sm text-primary hover:underline hidden sm:block">
            Full menu →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-background hover:border-primary/50 transition-colors"
            >
              <Link href={`/menu/${item.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-4xl">
                      ☕
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm leading-tight line-clamp-1">{item.name}</p>
                  <p className="mt-1 text-primary font-bold text-sm">{formatPKR(item.price)}</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <Button
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={() => handleAdd(item)}
                >
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/menu" className="text-sm text-primary hover:underline">
            See full menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
