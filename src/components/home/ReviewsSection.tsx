"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  guestName: string | null;
  createdAt: Date;
  user: { name: string | null } | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-16 bg-card">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-display text-4xl font-black uppercase text-primary">
            What People Say
          </h2>
          <p className="mt-2 text-muted-foreground">Real reviews from real Chae GPT fans.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-background p-5 space-y-3"
            >
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </p>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">
                  {review.user?.name ?? review.guestName ?? "Anonymous"}
                </span>
                <span className="text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
