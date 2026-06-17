"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "./MenuItemCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  spiceLevel: number;
  tags: string;
  categoryId: string;
  category: Category;
  options: { id: string; groupName: string; label: string; priceDelta: number }[];
}

interface Props {
  categories: Category[];
  items: MenuItem[];
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function MenuPageClient({ categories, items }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== "all" && item.categoryId !== activeCategory) return false;
      if (vegOnly && !item.tags.split(",").includes("veg")) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, activeCategory, vegOnly, search]);

  // Group filtered items by category (preserve category sort order)
  const grouped = useMemo(() => {
    const map = new Map<string, { category: Category; items: MenuItem[] }>();
    for (const item of filtered) {
      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, { category: item.category, items: [] });
      }
      map.get(item.categoryId)!.items.push(item);
    }
    return Array.from(map.values());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-5xl font-black uppercase text-primary">Our Menu</h1>
        <p className="mt-2 text-muted-foreground">
          Fresh flavours, student-friendly prices — all day, every day.
        </p>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setVegOnly((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
            vegOnly
              ? "border-green-500 bg-green-500/10 text-green-600 shadow-[0_0_12px_0_rgba(34,197,94,0.2)]"
              : "border-border text-muted-foreground hover:border-green-400"
          )}
        >
          🥦 Veg Only
        </button>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {[{ id: "all", name: "All", emoji: "🍽️" }, ...categories.map(c => ({ id: c.id, name: c.name, emoji: c.emoji ?? "" }))].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "border border-border hover:border-primary/50 text-muted-foreground hover:scale-102"
            )}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {grouped.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center text-muted-foreground"
          >
            No items found. Try a different search.
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory + search + vegOnly}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-14"
          >
            {grouped.map(({ category, items: catItems }) => (
              <motion.section key={category.id} variants={sectionVariants}>
                {/* Category heading with animated underline */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <div>
                    <h2 className="font-display text-2xl font-black uppercase leading-none">
                      {category.name}
                    </h2>
                    <div className="mt-1 h-0.5 w-12 rounded-full bg-primary" />
                  </div>
                  <Badge variant="secondary" className="font-normal text-xs ml-auto">
                    {catItems.length} item{catItems.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {catItems.map((item, idx) => (
                    <MenuItemCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </motion.section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
