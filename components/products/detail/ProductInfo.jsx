import Link from "next/link";
import { ArrowLeft, MessageCircle, Star } from "lucide-react";

import { Separator } from "@/components/ui/separator";


export function ProductInfo({ product }) {
  const importantSpecs = product.specifications?.slice(0, 2) ?? [];

  return (
    <div className="min-w-0">
      <h1 className="text-xl font-bold leading-relaxed sm:text-2xl">{product.name}</h1>

      <Separator className="my-4" />

      {/*
        امتیاز و نظرات — سیستم Rating/Review واقعی هنوز وجود ندارد.
        این بخش فقط UI را آماده نگه می‌دارد تا هروقت این فیلدها
        (rating, ratingCount, reviewCount) روی مدل واقعی پر شدند، بدون
        تغییر در ساختار کامپوننت، مقادیر واقعی نمایش داده شوند.
      */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-bold">{product.rating ?? "—"}</span>
          <span className="text-muted-foreground">
            ({product.ratingCount != null ? `${product.ratingCount} امتیاز` : "بدون امتیاز"})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle className="size-4" />
          <span>{product.reviewCount != null ? `${product.reviewCount} نظر` : "بدون نظر"}</span>
        </div>
      </div>

      {/* خلاصه مهم‌ترین مشخصات — فقط دو مورد اول */}
      {importantSpecs.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold">ویژگی‌های مهم</h2>
          <dl className="space-y-2">
            {importantSpecs.map((spec) => (
              <div key={spec.key} className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-muted-foreground">{spec.key}</dt>
                <dd className="font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="#specifications"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            مشاهده همه ویژگی‌ها
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
