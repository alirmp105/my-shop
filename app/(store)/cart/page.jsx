"use client";

import { LoaderCircle } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { cart, loading } = useCart();
  console.log("cart item :  " , cart);
  
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold">
          سبد خرید
        </h1>

        <EmptyCart />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">
        سبد خرید
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Cart Items */}
        <section>
          <div className="rounded-lg border px-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
              />
            ))}
          </div>
        </section>

        {/* Summary */}
        <aside>
          <CartSummary cart={cart} />
        </aside>
      </div>
    </main>
  );
}