"use client";
import { useState } from "react";
import { LoaderCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export function CartItemControl({ product }) {
  const { addToCart, updateCartItem, removeFromCart, getCartItemQuantity } =
    useCart();

  const [isUpdating, setIsUpdating] = useState(false);


  const productId = product._id || product.id;

  const quantity = getCartItemQuantity(productId);

  const isOutOfStock = product.stock <= 0;
  const isMaxQuantity = quantity >= product.stock;

  async function handleAdd() {
    if (isUpdating || isOutOfStock) {
      return;
    }

    try {
      setIsUpdating(true);

      await addToCart(productId, 1);

      toast.success(`«${product.name}» به سبد خرید اضافه شد.`);
    } catch (error) {
      console.error("Add to cart error:", error);

      toast.error(error.message || "افزودن به سبد خرید ناموفق بود.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleIncrease() {
    if (isUpdating || isMaxQuantity) {
      return;
    }

    try {
      setIsUpdating(true);

      await updateCartItem(productId, quantity + 1);
    } catch (error) {
      console.error("Increase cart item error:", error);

      toast.error(error.message || "افزایش تعداد ناموفق بود.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDecrease() {
    if (isUpdating || quantity <= 1) {
      return;
    }

    try {
      setIsUpdating(true);

      await updateCartItem(productId, quantity - 1);
    } catch (error) {
      console.error("Decrease cart item error:", error);

      toast.error(error.message || "کاهش تعداد ناموفق بود.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    if (isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);

      await removeFromCart(productId);

      toast.success(`«${product.name}» از سبد خرید حذف شد.`);
    } catch (error) {
      console.error("Remove cart item error:", error);

      toast.error(error.message || "حذف از سبد خرید ناموفق بود.");
    } finally {
      setIsUpdating(false);
    }
  }

  if (quantity === 0) {
    return (
      <Button
        type="button"
        onClick={handleAdd}
        disabled={isUpdating || isOutOfStock}
        className="w-full py-5"
      >
        <ShoppingCart />

        {isOutOfStock
          ? "ناموجود"
          : isUpdating
            ? "در حال افزودن..."
            : "افزودن به سبد"}
      </Button>
    );
  }

  return (
    <div className="flex ">
      <Button
        type="button"
        className="rounded-l-none border-0 px-4 py-5"
        onClick={handleIncrease}
        disabled={isUpdating || isMaxQuantity}
        aria-label="افزایش تعداد"
      >
        <Plus />
      </Button>

      <div
        className="flex flex-1 items-center justify-center border-y text-sm font-medium px-5"
        aria-live="polite"
      >
        {isUpdating ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          quantity
        )}
      </div>

      <Button
        type="button"
        className={`rounded-r-none  py-5 px-4 ${quantity === 1 ? "border-0" : ""}`}
        onClick={quantity === 1 ? handleRemove : handleDecrease}
        variant={quantity === 1 ? "destructive" : "outline"}
        disabled={isUpdating}
        aria-label={quantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
      >
        {quantity === 1 ? <Trash2 /> : <Minus />}
      </Button>
    </div>
  );
}
