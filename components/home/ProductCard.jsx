"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatToman } from "@/lib/utils";
import { CartItemControl } from "../cart/CartItemControl";
import { useCart } from "@/lib/cart-context";
import CartItemControlSkeleton from "../cart/CartItemControlSkeleton";
import { Heart } from "lucide-react";
export function ProductCard({ product }) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

 const {loading } = useCart()
  return (
     <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg dark:hover:shadow-primary/5">
      
      {/* بخش تصویر محصول */}
      <div className="relative aspect-square w-full overflow-hidden p-4">
        <Link
          href={`/products/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 70vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* نشان تخفیف مدرن در گوشه راست بالا */}
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3 rounded-lg px-2 py-0.5 text-xs font-bold shadow-sm"
          >
            {discountPercent}٪-
          </Badge>
        )}

        {/* اختیاری: دکمه علاقه‌مندی یا وضعیت موجودی */}
        
        <button className="absolute top-3 left-3 rounded-full bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:text-rose-500">
          <Heart className="h-4 w-4" />
        </button>        
      </div>

      {/* بخش اطلاعات و عنوان */}
      <CardContent className="flex flex-1 flex-col justify-between p-4 pb-2">
        <div>
          {/* دسته‌بندی اختیاری کوچک برای سلسله مراتب بصری بهتر */}
          {product.category && (
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">
              {product.category.name || product.category}
            </span>
          )}

          <Link href={`/products/${product.slug}`}>
            <h3
              title={product.name}
              className="line-clamp-2 text-sm font-semibold text-foreground/90 transition-colors group-hover:text-primary leading-snug"
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* بخش نمایش قیمت */}
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-dashed border-border/60 pt-3">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground/70 line-through">
                {formatToman(product.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-foreground tracking-tight">
                {formatToman(product.price)}
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                تومان
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* دکمه اکشن و افزودن به سبد خرید */}
      <CardFooter className="p-4 pt-2">
        <div className="w-full">
          {loading ? (
            <CartItemControlSkeleton />
          ) : (
            <CartItemControl product={product} />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
