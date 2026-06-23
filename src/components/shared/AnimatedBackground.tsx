export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="animated-bg-pan absolute inset-0 bg-gradient-to-br from-background via-background to-primary/[0.06]" />
      <div className="animated-bg-blob-a absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
      <div className="animated-bg-blob-b absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
      <div className="animated-bg-blob-c absolute -bottom-40 left-1/4 h-[380px] w-[380px] rounded-full bg-primary/[0.08] blur-3xl" />
    </div>
  );
}
