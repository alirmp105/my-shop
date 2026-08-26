import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-center">
      <div className="rounded-full bg-muted p-5">
        <ShoppingCart className="size-10 text-muted-foreground" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          سبد خرید شما خالی است
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          محصولی به سبد خرید اضافه نشده است.
        </p>
      </div>

      <Button asChild>
        <Link href="/products">
          مشاهده محصولات
        </Link>
      </Button>
    </div>
  );
}