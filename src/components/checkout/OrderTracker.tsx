import { CheckCircle2, Circle } from "lucide-react";

const DELIVERY_STEPS = [
  { status: "PENDING", label: "Order Received" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PREPARING", label: "Preparing" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

const PICKUP_STEPS = [
  { status: "PENDING", label: "Order Received" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PREPARING", label: "Preparing" },
  { status: "DELIVERED", label: "Ready for Pickup" },
];

export function OrderTracker({ status, type }: { status: string; type: string }) {
  const steps = type === "DELIVERY" ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIndex = steps.findIndex((s) => s.status === status);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
        <div
          className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
          style={{
            height: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`,
          }}
        />

        <ol className="space-y-6 relative">
          {steps.map((step, i) => {
            const done = i <= currentIndex;
            const current = i === currentIndex;
            return (
              <li key={step.status} className="flex items-center gap-4 pl-2">
                <div className="z-10">
                  {done ? (
                    <CheckCircle2 className={`h-8 w-8 ${current ? "text-primary animate-pulse" : "text-primary"}`} />
                  ) : (
                    <Circle className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>
                <span className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {current && (
                  <span className="ml-auto text-xs text-primary font-medium">Current</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {status === "CANCELLED" && (
        <div className="mt-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          This order was cancelled. Please contact us if you have any questions.
        </div>
      )}
    </div>
  );
}
