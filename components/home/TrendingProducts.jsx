// import { products } from "@/data/products";

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

export async function TrendingProducts() {
  const products = await getTrendProducts();
  return (
    <section id="trending" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-2 text-center sm:text-right flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            محصولات پربازدید
          </h2>

          <Link href="/products" className="font-light mt-3 hover:font-medium">
            مشاهده همه
          </Link>
        </div>

        <hr className="mb-4" />
        {/* opts.direction: "rtl" هماهنگ با جهت درگ/اسکرول متن فارسی */}
        <Carousel
          opts={{ align: "start", direction: "rtl" }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product._id}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
