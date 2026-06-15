"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "./MenuItemCard";
import { cn } from "@/lib/utils";

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

  // Group filtered items by category
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
      <div className="mb-8">
        <h1 className="font-display text-5xl font-black uppercase text-primary">Our Menu</h1>
        <p className="mt-2 text-muted-foreground">
          Fresh flavours, student-friendly prices — all day, every day.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
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
            "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            vegOnly
              ? "border-green-500 bg-green-500/10 text-green-600"
              : "border-border text-muted-foreground hover:border-green-400"
          )}
        >
          🥦 Veg Only
        </button>
      </div>

      {/* Category tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:border-primary/50 text-muted-foreground"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:border-primary/50 text-muted-foreground"
            )}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {grouped.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No items found. Try a different search.</div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ category, items: catItems }) => (
            <div key={category.id}>
              <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-black uppercase">
                <span>{category.emoji}</span> {category.name}
                <Badge variant="secondary" className="font-normal text-xs ml-1">{catItems.length}</Badge>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
