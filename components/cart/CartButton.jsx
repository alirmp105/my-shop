"use client";

import { useState } from "react";
import { Plus, ShoppingCart, Trash2, Minus } from "lucide-react";

// import { addToCart } from "@/services/cart";
import { addToCart } from "@/services/cart"
import { Button } from "../ui/button";

export default function ProductCard({ product, cart, setCart }) {
  const [loading, setLoading] = useState(false);

  const cartItem = cart?.items?.find( 
    (item) => item.product._id === product._id
  );

  
  const quantity = cartItem?.quantity ?? 0;

  async function handleAddToCart() {
    try {
      setLoading(true);

      const data = await addToCart(product.id, 1);

      setCart(data.cart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  function handleIncrease() {
    // بعداً به PATCH /api/cart متصل می‌شود
    console.log("increase", product._id);
  }

  function handleDecrease() {
    // بعداً به PATCH /api/cart متصل می‌شود
    console.log("decrease", product._id);
  }

  function handleRemove() {
    // بعداً به DELETE /api/cart متصل می‌شود
    console.log("remove", product._id);
  }

  // محصول در Cart نیست
  if (quantity === 0) {
    return (
      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || product.stock === 0}
         variant="outline"
       
      >
        <ShoppingCart size={18} />

        {loading ? "در حال افزودن..." : "افزودن به سبد خرید"}
      </Button>
    );
  }

  // محصول داخل Cart است
  return (
    <div>
      {/* افزایش */}
      <Button
       
        onClick={handleIncrease}
        disabled={quantity >= product.stock}
        aria-label="افزایش تعداد"
        variant="outline"
        
      >
        <Plus size={18} />
      </Button>

      {/* تعداد */}
      <span>{quantity}</span>

      {/* کاهش یا حذف */}
      <button
        type="button"
        onClick={quantity === 1 ? handleRemove : handleDecrease}
        aria-label={quantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
         variant="outline"
      >

        {quantity === 1 ? (
          <Trash2 size={18} />
        ) : (
          <Minus size={18} />
        )}

        

      </button>
    </div>
  );
}