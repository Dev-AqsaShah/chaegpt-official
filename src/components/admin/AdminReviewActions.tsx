"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, EyeOff } from "lucide-react";

export function AdminReviewActions({ reviewId, approved }: { reviewId: string; approved: boolean }) {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(approved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !isApproved }),
    });
    setLoading(false);
    if (!res.ok) { toast.error("Failed"); return; }
    setIsApproved((v) => !v);
    toast.success(isApproved ? "Review hidden" : "Review approved");
    router.refresh();
  }

  return (
    <Button
      variant={isApproved ? "outline" : "default"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="shrink-0 gap-1.5"
    >
      {isApproved ? (
        <><EyeOff className="h-3.5 w-3.5" /> Hide</>
      ) : (
        <><Check className="h-3.5 w-3.5" /> Approve</>
      )}
    </Button>
  );
}
