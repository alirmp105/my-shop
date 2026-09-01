import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import img from "@/public/images/hero2.jpg"
export function HeroSection() {
  return (
    <section className="border-b bg-muted/30 w-full">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="text-center lg:text-right">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            کالکشن جدید ۱۴۰۴
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            استایل خودت را با جدیدترین کالکشن بساز
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            بیش از هزار محصول با کیفیت و قیمت مناسب، همراه با ارسال رایگان برای خریدهای بالای
            ۵۰۰ هزار تومان.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" asChild>
              <Link href="#products">
                همین حالا خرید کن
                <ArrowLeft />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">مشاهده دسته‌بندی‌ها</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={img}
            alt="کالکشن جدید فروشگاه"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
