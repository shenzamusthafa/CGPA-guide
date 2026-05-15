import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 shadow-[0_8px_32px_-12px_oklch(0_0_0_/_0.1)] dark:shadow-[0_8px_32px_-12px_oklch(0_0_0_/_0.5)]",
        className
      )}
      {...props}
    />
  );
}