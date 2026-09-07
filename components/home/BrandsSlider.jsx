import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getBrands } from "@/lib/data/brands";

export async function BrandsSlider() {
  const brands = await getBrands();

  return (
    <section className="border-y bg-muted/30 py-8 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-xl font-bold tracking-tight sm:text-3xl">
            برندهای ویژه
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            همکاری با برترین برندهای بازار
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true, direction: "rtl" }}
          className="mx-auto w-full"
        >
          <CarouselContent className="-ml-3">
            {brands.map((brand) => (
              <CarouselItem
                key={brand._id}
                className="pl-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <Link
                  href={`/brand/${brand.slug}`}
                  className="group flex h-16 sm:h-24 items-center justify-center rounded-xl border bg-background p-3 sm:p-4 grayscale transition-all duration-300 hover:grayscale-0 hover:border-primary/30 hover:shadow-md active:scale-95"
                >
                  <Image
                    src={brand.image}
                    alt={brand.nameFa}
                    width={140}
                    height={70}
                    className="h-auto max-h-8 sm:max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
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
