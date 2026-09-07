import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { getCategories } from "@/lib/data/categories";
import { Sparkles } from "lucide-react";

export async function CategoriesSection() {
  const categories = await getCategories();
  return (
    <section id="categories" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* هدر دسته‌بندی‌ها */}
        <div className="mb-8 text-center sm:text-right flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>دسترسی سریع</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
              دسته‌بندی‌های محبوب
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              آنچه را که به دنبالش هستید سریع‌تر پیدا کنید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-muted/30 p-2 sm:p-3 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5">
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
                  <Image
                    src={category.image}
                    alt={category.nameFa}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/25" />
                </div>
              </div>

              <div className="mt-2 sm:mt-3 px-1">
                <span className="line-clamp-1 text-xs sm:text-sm font-semibold text-foreground/90 transition-colors group-hover:text-primary">
                  {category.nameFa}
                </span>
                {category.productCount !== undefined && (
                  <span className="hidden sm:block text-[11px] text-muted-foreground mt-0.5">
                    {category.productCount} کالا
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
