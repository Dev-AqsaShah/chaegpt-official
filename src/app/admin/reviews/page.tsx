import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminReviewActions } from "@/components/admin/AdminReviewActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Reviews" };
export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black uppercase">Reviews</h1>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border/50 bg-card p-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {review.user?.name ?? review.guestName ?? "Anonymous"}
                </span>
                <span className="text-primary font-bold text-sm">{"★".repeat(review.rating)}</span>
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">&ldquo;{review.comment}&rdquo;</p>
              )}
            </div>
            <AdminReviewActions reviewId={review.id} approved={review.approved} />
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
