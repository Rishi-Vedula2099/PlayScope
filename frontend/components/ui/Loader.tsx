import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Loader({ size = "md", className, text }: LoaderProps) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        <div
          className={cn(
            sizes[size],
            "rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin"
          )}
        />
        <div
          className={cn(
            sizes[size],
            "absolute inset-0 rounded-full border-2 border-transparent border-b-[var(--accent)] animate-spin"
          )}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      {text && (
        <p className="text-sm text-[var(--text-secondary)] animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-5 space-y-3", className)}>
      <div className="h-4 w-1/3 bg-white/5 rounded animate-shimmer" />
      <div className="h-8 w-2/3 bg-white/5 rounded animate-shimmer" />
      <div className="h-3 w-1/2 bg-white/5 rounded animate-shimmer" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard className="h-[400px]" />
        </div>
        <SkeletonCard className="h-[400px]" />
      </div>
      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard className="h-[300px]" />
        <SkeletonCard className="h-[300px]" />
      </div>
    </div>
  );
}
