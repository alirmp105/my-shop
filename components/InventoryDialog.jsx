"use client";

import React, { useEffect, useState } from "react";
import { Minus, Package, Plus, Save } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast} from "sonner"
import { useRouter } from "next/navigation";

const InventoryEditDialog = ({ product }) => {
  const [open, setOpen] = useState(false);

  const [type, setType] = useState("increase");
  const [quantity, setQuantity] = useState("");
  const router = useRouter()

  const currentStock = product.stock;

  const changeAmount = Number(quantity) || 0;

  const newStock =
    type === "increase"
      ? currentStock + changeAmount
      : currentStock - changeAmount;

  const isInvalidDecrease = type === "decrease" && changeAmount > currentStock;

  // وقتی Dialog بسته شد، فرم را به حالت اولیه برگردان
  useEffect(() => {
    if (!open) {
      setType("increase");
      setQuantity("");
    }
  }, [open]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!quantity || changeAmount <= 0) {
  //     return;
  //   }

  //   if (isInvalidDecrease) {
  //     return;
  //   }

  //   console.log({
  //     productId: product.id,
  //     type,
  //     quantity: changeAmount,
  //     currentStock,
  //     newStock,
  //   });

  //   // فعلاً فقط UI
  //   // بعداً اینجا PATCH API را اضافه می‌کنیم

  //   setOpen(false);
  // };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!quantity || changeAmount <= 0) {
    return;
  }

  if (isInvalidDecrease) {
    return;
  }

  try {
    const res = await fetch(
      `/api/inventory/${product.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          quantity: changeAmount,
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      toast.error(
        result.message || "خطایی رخ داد.",
        {
          position: "top-center",
        }
      );

      return;
    }

    toast.success(
      "موجودی با موفقیت تغییر کرد.",
      {
        position: "top-center",
      }
    );

    setOpen(false);

    router.refresh()

    // بعداً داده‌های جدول را Refresh می‌کنیم
  } catch (error) {
    console.error(error);

    toast.error(
      "ارتباط با سرور برقرار نشد.",
      {
        position: "top-center",
      }
    );
  }
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ویرایش موجودی
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">ویرایش موجودی</DialogTitle>

          <DialogDescription className="text-center">
            موجودی محصول را افزایش یا کاهش دهید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Package className="size-5" />

            <div>
              <p className="font-medium">{product.name}</p>

              <p className="text-sm text-muted-foreground">
                موجودی فعلی: {currentStock}
              </p>
            </div>
          </div>

          {/* Current Stock */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">موجودی فعلی</p>

            <p className="text-3xl font-bold">{currentStock}</p>
          </div>

          {/* Change Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium">نوع تغییر</p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === "increase" ? "default" : "outline"}
                onClick={() => setType("increase")}
              >
                <Plus />
                افزایش
              </Button>

              <Button
                type="button"
                variant={type === "decrease" ? "destructive" : "outline"}
                onClick={() => setType("decrease")}
              >
                <Minus />
                کاهش
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              مقدار تغییر
            </label>

            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="مثلاً 10"
            />

            {isInvalidDecrease && (
              <p className="text-sm text-destructive">
                مقدار کاهش نمی‌تواند بیشتر از موجودی فعلی باشد.
              </p>
            )}
          </div>

          {/* New Stock */}
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">موجودی پس از تغییر</p>

            <p
              className={`text-2xl font-bold ${
                isInvalidDecrease ? "text-destructive" : ""
              }`}
            >
              {newStock}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              لغو
            </Button>

            <Button
              type="submit"
              disabled={!quantity || changeAmount <= 0 || isInvalidDecrease}
            >
              <Save />
              ثبت تغییر
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryEditDialog;
