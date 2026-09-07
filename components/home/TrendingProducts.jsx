import { ProductCard } from "@/components/home/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getTrendProducts } from "@/lib/data/products";
import Link from "next/link";
import { ArrowLeft, Flame} from "lucide-react";

export async function TrendingProducts() {
  const products = await getTrendProducts();
   return (
    <section id="trending" className="py-12 sm:py-16 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>محبوب‌ترین‌ها</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              محصولات پربازدید
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              پرفروش‌ترین و پرطرفدارترین انتخاب‌های کاربران در هفته گذشته
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-fit self-end sm:self-auto"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
            dragFree: true, 
          }}
          className="w-full relative"
        >
         
          <CarouselContent className="-ml-3 sm:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product._id}
              
                className="pl-3 sm:pl-4 basis-[72%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden sm:block">
            <CarouselPrevious className="-right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border shadow-md hover:bg-background transition-all" />
            <CarouselNext className="-left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border shadow-md hover:bg-background transition-all" />
          </div>
        </Carousel>

      </div>
    </section>
   )
}
