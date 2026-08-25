"use client";

import Image from "next/image";
import Link from "next/link";
// import { ShoppingCart } from "lucide-react";
// import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarRating } from "@/components/home/StarRating";
// import { useCart } from "@/lib/cart-context";
import { formatToman } from "@/lib/utils";
import {CartItemControl} from "../cart/CartItemControl";
// import { addToCart } from "@/services/cart";
export function ProductCard({ product }) {
  // const { addItem } = useCart();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    addToCart(product);
    toast.success(`«${product.name}» به سبد خرید اضافه شد.`);
  };

  return (
    <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.primaryImage}
            // src={img}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <Badge variant="destructive" className="absolute start-3 top-3">
              {discountPercent}٪ تخفیف
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="space-y-2 px-4 pt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-medium hover:underline">{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold">{formatToman(product.price)} تومان</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatToman(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        {/* <Button onClick={handleAdd} className="w-full" size="sm">
          <ShoppingCart />
          افزودن به سبد
        </Button> */}
        <CartItemControl product={product} />
      </CardFooter>
    </Card>
  );
}
