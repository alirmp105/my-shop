

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