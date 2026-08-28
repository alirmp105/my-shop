import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Title */}
      <Skeleton className="h-8 w-32" />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-4 rounded-lg border p-4"
            >
              {/* Product Image */}
              <Skeleton className="h-28 w-28 shrink-0 rounded-md" />

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>

                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="h-fit space-y-4 rounded-lg border p-5">
          <Skeleton className="h-6 w-32" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}