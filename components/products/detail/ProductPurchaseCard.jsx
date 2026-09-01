// "use client";

// import { useCallback, useState } from "react";
// import { Minus, Plus, ShoppingCart } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// // ⚠️ این import را با هوک/Context واقعی سبد خرید پروژه‌ی خودتان جایگزین
// // کنید. اینجا فرض شده useCart() تابعی به‌شکل addToCart(product, quantity)
// // برمی‌گرداند. sync یا async بودن آن مهم نیست چون با await صدا زده می‌شود.
// import { useCart } from "@/lib/cart-context";

// function formatPrice(value) {
//   return new Intl.NumberFormat("fa-IR").format(value ?? 0);
// }

// /**
//  * کارت خرید — قیمت، وضعیت موجودی، کنترل تعداد، دکمه افزودن به سبد.
//  * تنها بخش‌های تعاملی (quantity، فراخوانی سبد خرید) این کامپوننت را
//  * Client می‌کنند.
//  */
// export function ProductPurchaseCard({ product }) {
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   const inStock = product.stock > 0;
//   const maxQuantity = Math.min(product.stock ?? 1, 10);

//   const increment = useCallback(() => {
//     setQuantity((current) => Math.min(maxQuantity, current + 1));
//   }, [maxQuantity]);

//   const decrement = useCallback(() => {
//     setQuantity((current) => Math.max(1, current - 1));
//   }, []);

//   const handleAddToCart = useCallback(async () => {
//     setIsAdding(true);
//     try {
//       await addToCart(product, quantity);
//     } finally {
//       setIsAdding(false);
//     }
//   }, [addToCart, product, quantity]);

//   return (
//     <div className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-24">
//       <p className="mb-4 text-2xl font-extrabold">{formatPrice(product.price)} تومان</p>

//       <div className="mb-4">
//         {inStock ? (
//           <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
//             موجود در انبار
//           </Badge>
//         ) : (
//           <Badge variant="destructive">ناموجود</Badge>
//         )}
//       </div>

//       {inStock && (
//         <div className="mb-4 flex items-center gap-3">
//           <span className="text-sm text-muted-foreground">تعداد</span>
//           <div className="inline-flex items-center rounded-lg border">
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="size-8 rounded-lg rounded-e-none"
//               onClick={decrement}
//               disabled={quantity <= 1}
//               aria-label="کاهش تعداد"
//             >
//               <Minus className="size-3.5" />
//             </Button>
//             <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="size-8 rounded-lg rounded-s-none"
//               onClick={increment}
//               disabled={quantity >= maxQuantity}
//               aria-label="افزایش تعداد"
//             >
//               <Plus className="size-3.5" />
//             </Button>
//           </div>
//         </div>
//       )}

//       <Button className="w-full" size="lg" disabled={!inStock || isAdding} onClick={handleAddToCart}>
//         <ShoppingCart className="size-4" />
//         {!inStock ? "ناموجود" : isAdding ? "در حال افزودن..." : "افزودن به سبد خرید"}
//       </Button>
//     </div>
//   );
// }


"use client";

import { useCallback, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { CartItemControl } from "@/components/cart/CartItemControl";
import Link from "next/link";
import CartItemControlSkeleton from "@/components/cart/CartItemControlSkeleton";
function formatPrice(value) {
  return new Intl.NumberFormat("fa-IR").format(value ?? 0);
}

export function ProductPurchaseCard({ product }) {

  const {loading} = useCart()
  console.log(loading);
  
  return (
    <div className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-24">
      
      <p className="mb-4 text-2xl font-extrabold">
        {formatPrice(product.price)} تومان
      </p>

      {/* <div className="mb-4"> */}
        {/* {inStock ? (
          <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            موجود در انبار
          </Badge>
        ) : (
          <Badge variant="destructive">ناموجود</Badge>
        )} */}
      {/* </div> */}
      
      <div className="flex ">
      {loading ? (<CartItemControlSkeleton />) : ( <CartItemControl product={product} />)  }  
     
      {/* <div>
      <p className="font-medium ">
        در سبد خرید شما 
        مشاهد در 
        <Link href="/cart">
        سبد خرید
        </Link>
      </p>
      </div> */}
      </div>
    </div>
  );
}