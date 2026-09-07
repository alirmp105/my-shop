"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronLeft, ArrowLeft, PercentCircle } from "lucide-react";
import { Button } from "../ui/button";
import { formatToman } from "@/lib/utils";

// تابعی برای تبدیل اعداد به فارسی و فرمت‌بندی ۳ رقم


export default function IncredibleOffers({products}) {

  // تایمر شمارش معکوس نمونه (مثلاً ۶ ساعت)
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="bg-zinc-800 rounded-3xl p-3 sm:p-4 text-white shadow-xl">
        <Carousel
          opts={{
            direction: "rtl",
            align: "start",
            dragFree: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-mr-2 md:-mr-3 flex items-center">
            
            {/* کارت اول: بنر و تایمر شگفت‌انگیز */}
            <CarouselItem className="pr-2 md:pr-3 basis-[150px] sm:basis-[180px] shrink-0">
              <div className="flex flex-col items-center justify-between h-[310px] py-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <PercentCircle />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    شگفتـ<br />انگیز
                  </h3>
                </div>

                {/* تایمر معکوس */}
                <div className="flex items-center gap-1 font-mono text-sm font-bold bg-black/20 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>:
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span>:
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                </div>

                {/* لینک مشاهده همه */}
                <Button asChild className="bg-white/90 text-zinc-800 hover:bg-white hover:text-zinc-950" >
                <Link
                  href="/offers"
                  className="flex items-center gap-1 text-xs font-medium text-white/90 hover:text-white transition-colors group"
                >
                  <span>مشاهده همه</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                </Button>
              </div>
            </CarouselItem>

            {/* کارت‌های محصولات */}
            {products?.map((item) => {
              const discountPercent = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;

              return (
                <CarouselItem
                  key={item._id || item.id}
                  className="pr-2 md:pr-3 basis-[175px] sm:basis-[200px] md:basis-[220px] shrink-0"
                >
                  <Link
                    href={`/products/${item.slug || item._id}`}
                    className="group flex flex-col justify-between h-[310px] bg-background text-foreground rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 select-none"
                  >
                    {/* تصویر محصول */}
                    <div className="relative w-full h-36 mb-2 flex items-center justify-center overflow-hidden rounded-xl bg-muted/20">
                      <Image
                        src={item.primaryImage}
                        alt={item.titleFa || item.name}
                        fill
                        sizes="(max-width: 768px) 180px, 220px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* عنوان محصول */}
                    <p className="text-xs sm:text-sm font-medium line-clamp-2 text-zinc-700 dark:text-zinc-200 leading-snug">
                      {item.titleFa || item.name}
                    </p>

                    {/* قیمت و تخفیف */}
                    <div className="mt-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        {discountPercent > 0 ? (
                          <Badge className="bg-rose-400 hover:bg-rose-500 text-white font-bold text-[11px] px-1.5 py-0.5 rounded-full">
                            {formatToman(discountPercent)}٪
                          </Badge>
                        ) : <span />}

                        <div className="flex items-baseline gap-1">
                          <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white" dir="rtl"> 
                            {formatToman(item.price)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">تومان</span>
                        </div>
                      </div>

                      {/* قیمت خط‌خورده */}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-left">
                          <span className="text-[11px] text-muted-foreground line-through decoration-zinc-400">
                            {toPersianDigits(item.originalPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}

            {/* کارت پایانی: مشاهده همه */}
            <CarouselItem className="pr-2 md:pr-3 basis-[130px] sm:basis-[150px] shrink-0">
              <Link
                href="/offers"
                className="flex flex-col items-center justify-center gap-3 h-[310px] bg-background/90 hover:bg-background text-foreground rounded-2xl p-4 text-center transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold">
                  مشاهده همه
                </span>
              </Link>
            </CarouselItem>

          </CarouselContent>

          {/* فلش‌های ناوبری در دسکتاپ */}
          <div className="hidden md:block">
            <CarouselPrevious className="-right-4 top-1/2 -translate-y-1/2 bg-white text-zinc-800 shadow-lg hover:bg-zinc-100 border-none w-9 h-9" />
            <CarouselNext className="-left-4 top-1/2 -translate-y-1/2 bg-white text-zinc-800 shadow-lg hover:bg-zinc-100 border-none w-9 h-9" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
