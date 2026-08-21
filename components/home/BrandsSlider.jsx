import Image from "next/image";
import img from "@/public/images/gplus.jpg"
import { brands } from "@/data/brands";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getBrands } from "@/lib/data/brands";

export async function BrandsSlider() {
  const brands = await getBrands()
  return (
    <section className="border-y bg-muted/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">برندهای ویژه</h2>
          <p className="mt-2 text-sm text-muted-foreground">همکاری با برترین برندهای بازار</p>
        </div>

        <Carousel opts={{ align: "start", loop: true, direction: "rtl" }} className="mx-auto max-w-5xl">
          <CarouselContent>
            {brands.map((brand) => (
              <CarouselItem key={brand.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="flex h-24 items-center justify-center rounded-xl border bg-background p-4 grayscale transition hover:grayscale-0">
                  <Image
                    src={brand.image}
                    alt={brand.nameFa}
                    width={140}
                    height={70}
                    className="h-auto max-h-12 w-auto"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
