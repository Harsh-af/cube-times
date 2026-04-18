import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-2xl bg-gray-200/80 dark:bg-white/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
