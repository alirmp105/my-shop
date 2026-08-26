import Image from "next/image";
import Link from "next/link";

// import { categories } from "@/data/categories";
import { Card } from "@/components/ui/card";
import { cachedCategoreis, getCategories } from "@/lib/data/categories";



export async function CategoriesSection () {
  const categories = await getCategories()
  return (
    <section id="categories" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">دسته‌بندی‌های محبوب</h2>
          <p className="mt-2 text-sm text-muted-foreground">آنچه را که به دنبالش هستید سریع‌تر پیدا کنید</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${
              category.slug}`}>
              <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
                  <span className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
                    {category.name}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
