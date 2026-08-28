import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="container mx-auto space-y-6 py-8 flex min-h-[60vh] flex-col items-center justify-center text-center ">
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