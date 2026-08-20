import { Copy, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DiscountBanner() {
  return (
    <section className="bg-primary py-12 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-right">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
            <Percent className="size-7" />
          </span>
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">تا ۳۰٪ تخفیف ویژه، فقط این هفته</h3>
            <p className="mt-1 text-sm text-primary-foreground/80">
              با کد زیر در تسویه‌حساب از تخفیف استفاده کنید.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            dir="ltr"
            className="rounded-lg border-2 border-dashed border-primary-foreground/40 px-4 py-2 font-mono text-lg font-bold tracking-widest"
          >
            SALE30
          </span>
          <Button variant="secondary" size="icon" aria-label="کپی کد تخفیف">
            <Copy />
          </Button>
        </div>
      </div>
    </section>
  );
}
