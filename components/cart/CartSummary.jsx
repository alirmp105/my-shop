import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatToman } from "@/lib/utils";

export function CartSummary({ cart }) {
  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Card className="sticky top-4">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">
          خلاصه سفارش
        </h2>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            تعداد کالا
          </span>

          <span>{totalItems} کالا</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            جمع کالاها
          </span>

          <span>
            {formatToman(cart.totalPrice)} تومان
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              مبلغ قابل پرداخت
            </span>

            <span className="text-lg font-bold">
              {formatToman(cart.totalPrice)} تومان
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full"
          size="lg"
        >
          <Link href="/checkout">
            ادامه و تسویه حساب
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}