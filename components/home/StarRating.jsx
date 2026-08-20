import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < Math.round(rating);
          return (
            <Star
              key={index}
              className={cn(
                "size-3.5",
                filled ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40"
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating} {reviewCount ? `(${reviewCount})` : ""}
      </span>
    </div>
  );
}
