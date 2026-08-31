/**
 * جدول کامل مشخصات فنی محصول. اگر specifications خالی باشد یا اصلاً
 * وجود نداشته باشد، این بخش چیزی رندر نمی‌کند (بدون خطا).
 *
 * عمداً از یک div/grid ساده استفاده شده، نه کامپوننت Table شادcn — چون
 * وجود آن در پروژه شما تأیید نشده بود؛ اگر خودتان components/ui/table.jsx
 * دارید و ترجیح می‌دهید از آن استفاده شود، به‌راحتی قابل جایگزینی است.
 */
export function ProductSpecifications({ specifications = [] }) {
  if (!specifications || specifications.length === 0) {
    return null;
  }

  return (
    // scroll-mt-24 باعث می‌شود لینک #specifications دقیقاً زیر هدر چسبان
    // متوقف شود، نه پشت آن
    <section id="specifications" className="scroll-mt-24">
      <h2 className="mb-4 text-lg font-bold">مشخصات محصول</h2>

      <div className="divide-y overflow-hidden rounded-xl border">
        {specifications.map((spec, index) => (
          <div key={spec.key + index} className="grid grid-cols-2 text-sm">
            <div className="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">{spec.key}</div>
            <div className="px-4 py-3 font-medium">{spec.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
