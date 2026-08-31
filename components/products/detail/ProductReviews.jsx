import { MessageCircle } from "lucide-react";

/**
 * ساختار UI آماده برای سیستم نظرات آینده. طبق درخواست، سیستم Review
 * واقعی پیاده‌سازی نشده و از Mock Data هم استفاده نشده — فقط یک حالت
 * خالی مناسب نمایش داده می‌شود.
 */
export function ProductReviews({ reviewCount }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">
        نظرات کاربران {reviewCount ? <span className="text-muted-foreground">({reviewCount})</span> : null}
      </h2>

      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-12 text-center text-muted-foreground">
        <MessageCircle className="size-8" />
        <p className="text-sm">هنوز نظری برای این محصول ثبت نشده است.</p>
      </div>
    </section>
  );
}
