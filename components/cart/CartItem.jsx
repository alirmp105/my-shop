
"use client";

import Image from "next/image";
import Link from "next/link";

import { CartItemControl } from "@/components/cart/CartItemControl";
import { formatToman } from "@/lib/utils";

export function CartItem({ item }) {
  const { product } = item;
  console.log("product in cartItem :" , product);
  
  const primaryImage =
    product?.images?.find((image) => image.isPrimary)?.url ??
    product?.images?.[0]?.url ??
    null;

  return (
    <div className="flex gap-4 border-b py-5 px-2 sm:px-8 last:border-b-0">
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
