"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * گالری تصاویر محصول. تنها دلیل Client بودن این کامپوننت، state انتخاب
 * تصویر فعلی است.
 *
 * @param {string[]} images - آرایه‌ای از URL تصاویر. اگر ساختار images
 *   در پروژه شما آرایه‌ای از آبجکت است، قبل از پاس دادن آن را به آرایه‌ای
 *   از رشته map کنید (یا این کامپوننت را متناسب تغییر دهید).
 * @param {string} productName
 */
export function ProductGallery({ images = [], productName }) {
  const hasImages = images.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = hasImages ? images[selectedIndex] : null;

  return (
    <div className="flex flex-col gap-3">
      {/* تصویر اصلی */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-10" />
            <span className="text-xs">تصویری موجود نیست</span>
          </div>
        )}
      </div>

      {/* Thumbnails — فقط وقتی بیش از یک تصویر وجود دارد */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-colors",
                index === selectedIndex ? "border-primary" : "border-transparent hover:border-border"
              )}
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-current={index === selectedIndex}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
