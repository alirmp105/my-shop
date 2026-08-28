
"use client";

import { useCart } from "@/lib/cart-context";

import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { cart, loading } = useCart();
  console.log("page cart : " , cart , loading);
  

  // اول Loading را بررسی می‌کنیم
  if (loading) {
    return <CartSkeleton />;
  }

  // فقط وقتی مطمئن شدیم Cart لود شده،
  // خالی بودن آن را بررسی می‌کنیم
  if (!cart?.items?.length) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <h1 className="text-2xl font-bold mx-3">سبد خرید</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
            />
          ))}
        </div>

        <CartSummary cart={cart} />
      </div>
    </div>
  );
}