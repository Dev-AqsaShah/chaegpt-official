"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  _count: { items: number };
}

export function CategoriesShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="border-b border-border/50 bg-card py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-5 font-display text-xl font-black uppercase text-muted-foreground"
        >
          Browse by Category
        </motion.h2>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/menu?cat=${cat.slug}`}
                className="flex shrink-0 flex-col items-center gap-2 rounded-2xl border border-border/50 bg-background px-5 py-4 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="whitespace-nowrap text-sm font-semibold">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat._count.items} items</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
