// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { Trash2 } from "lucide-react";
// // import { toast } from "sonner";

// // import { Button } from "@/components/ui/button";
// // import { CartItemControl } from "@/components/cart/CartItemControl";
// // import { useCart } from "@/lib/cart-context";
// // import { formatToman } from "@/lib/utils";

// // export function CartItem({ item }) {
// //   console.log(item);

// //   const { removeFromCart } = useCart();

// //   const product = item.product;
// //   console.log(product);

// //   async function handleRemove() {
// //     try {
// //       await removeFromCart(product.id);

// //       toast.success(
// //        ` «${product.name}» از سبد خرید حذف شد.`
// //       );
// //     } catch (error) {
// //       toast.error(
// //         error.message || "حذف محصول ناموفق بود."
// //       );
// //     }
// //   }

// //   return (
// //     <div className="flex gap-4 border-b py-5">
// //       {/* Image */}
// //       <Link
// //         href={`/products/${product.slug}`}
// //         className="relative size-28 shrink-0 overflow-hidden rounded-md bg-muted"
// //       >
// //         <Image
// //           src={product.images.find((image)=>image.isPrimary)?.url || null}
// //         //   src={product.image}
// //           alt={product.name}
// //           fill
// //           sizes="112px"
// //           className="object-cover"
// //         />
// //       </Link>

// //       {/* Content */}
// //       <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
// //         <div>
// //           <Link
// //             href={`/products/${product.slug}`}
// //             className="line-clamp-2 text-sm font-medium hover:underline"
// //           >
// //             {product.name}
// //           </Link>

// //           {product.stock <= 0 && (
// //             <p className="mt-2 text-xs text-destructive">
// //               این محصول ناموجود شده است.
// //             </p>
// //           )}
// //         </div>

// //         <div className="flex items-center justify-between gap-4">
// //           <CartItemControl product={product} />

// //           <div className="text-end">
// //             <p className="font-bold">
// //               {formatToman(item.price)} تومان
// //             </p>

// //             {item.quantity > 1 && (
// //               <p className="text-xs text-muted-foreground">
// //                 {formatToman(item.price)} × {item.quantity}
// //               </p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Remove */}
// //       <Button
// //         type="button"
// //         variant="ghost"
// //         size="icon"
// //         onClick={handleRemove}
// //         aria-label="حذف محصول"
// //         className="shrink-0"
// //       >
// //         <Trash2 />
// //       </Button>
// //     </div>
// //   );
// // }
// "use client";

// import Image from "next/image";
// import Link from "next/link";

// import { CartItemControl } from "@/components/cart/CartItemControl";
// import { formatToman } from "@/lib/utils";

// export function CartItem({ item }) {
//   const product = item.product;

//   return (
//     <div className="flex gap-4 border-b py-5">
//       <Link
//         href={`/products/${product.slug}`}
//         className="relative size-28 shrink-0 overflow-hidden rounded-md bg-muted"
//       >
//         <Image
//           src={product.images.find((image)=>image.isPrimary)?.url || null}
//           alt={product.name}
//           fill
//           sizes="112px"
//           className="object-cover"
//         />
//       </Link>

//       <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
//         <div>
//           <Link
//             href={`/products/${product.slug}`}
//             className="line-clamp-2 text-sm font-medium hover:underline"
//           >
//             {product.name}
//           </Link>
//         </div>

//         <div className="flex items-center justify-between ">
//           <CartItemControl product={product} className="w-fit" />

//           <div className="">
//             <p className="font-bold">
//               {formatToman(item.price)} تومان
//             </p>

//             {item.quantity > 1 && (
//               <p className="text-xs text-muted-foreground">
//                 {formatToman(item.price)} × {item.quantity}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";

import { CartItemControl } from "@/components/cart/CartItemControl";
import { formatToman } from "@/lib/utils";

export function CartItem({ item }) {
  const { product } = item;

  const primaryImage =
    product?.images?.find((image) => image.isPrimary)?.url ??
    product?.images?.[0]?.url ??
    null;

  return (
    <div className="flex gap-4 border-b py-5 last:border-b-0">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative size-28 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        <div className="relative h-28 w-28 overflow-hidden rounded-md bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product?.name ?? "محصول"}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              در حال بارگذاری تصویر...
            </div>
          )}
        </div>
      </Link>

      {/* Product Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        {/* Product Name */}
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium hover:underline"
        >
          {product.name}
        </Link>

        {/* Bottom Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Quantity Control */}
          <div className="w-36">
            <CartItemControl product={product} />
          </div>

          {/* Price */}
          <div className="text-end">
            <p className="font-bold">{formatToman(item.price)} تومان</p>

            {item.quantity > 1 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatToman(item.price)} × {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
