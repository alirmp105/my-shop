"use client";

import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export function CartItemControl({ product }) {
  const {
    addToCart,
    getCartItemQuantity,
  } = useCart();

  const quantity = getCartItemQuantity(product.id);

  const isOutOfStock = product.stock <= 0;
  const isMaxQuantity = quantity >= product.stock;

  async function handleAdd() {
    try {
      await addToCart(product.id);

      toast.success(
       ` «${product.name}» به سبد خرید اضافه شد.`
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleIncrease() {
    // مرحله بعد: PATCH
  }

  function handleDecrease() {
    // مرحله بعد: PATCH
  }

  function handleRemove() {
    // مرحله بعد: DELETE
  }

  if (quantity === 0) {
    return (
      <Button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock}
        className="w-full"
        size="sm"
        
      >
        <ShoppingCart />

        {isOutOfStock
          ? "ناموجود"
          : "افزودن به سبد"}
      </Button>
    );
  }

  return (
    <div className="flex w-full">
      <Button
        type="button"
        
        className="rounded"
        onClick={handleIncrease}
        disabled={isMaxQuantity}
        aria-label="افزایش تعداد"
        //  variant="outline"
      >
        <Plus />
      </Button>

      <div className="flex flex-1 items-center justify-center border-y text-sm font-medium">
        {quantity}
      </div>

      <Button
        type="button"
        // size="sm"
        className="rounded"
        //  variant={`{${quantity ===1 ? "destructive" : "outline"} `}
        variant= {
          quantity ===1 ? "destructive" : "outline"
        }
        onClick={
          quantity === 1
            ? handleRemove
            : handleDecrease
        }
        aria-label={
          quantity === 1
            ? "حذف از سبد"
            : "کاهش تعداد"
        }

      >
        {quantity === 1 ? (
          <Trash2  />
        ) : (
          <Minus />
        )}
      </Button>
    </div>
  );
}