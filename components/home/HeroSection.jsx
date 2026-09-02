
// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// const AUTO_PLAY_INTERVAL = 6000;

// /**
//  * محتوای پیش‌فرض — عمداً عمومی و غیرمتصل به یک دسته محصول خاص نوشته
//  * شده (پوشاک، دیجیتال، خوار و بار، ...) تا این کامپوننت بدون تغییر
//  * برای هر نوع فروشگاهی قابل استفاده باشد. برای استفاده واقعی، آرایه‌ی
//  * slides را از بیرون (مثلاً از صفحه اصلی) پاس بدهید.
//  *
//  * ⚠️ تصاویر placeholder (picsum.photos) هستند — یا با تصاویر واقعی
//  * فروشگاه جایگزین کنید، یا دامنه‌ی picsum.photos را به
//  * images.remotePatterns در next.config اضافه کنید.
//  */
// const DEFAULT_SLIDES = [
//   {
//     id: "new-arrivals",
//     badge: "تازه‌ترین‌ها",
//     title: "جدیدترین محصولات را همین حالا کشف کنید",
//     description: "تنوعی گسترده از بهترین برندها، با تضمین اصالت کالا و ارسال سریع به سراسر کشور.",
//     image: "/images/hero2.jpg",
//     imageAlt: "نمایش محصولات فروشگاه",
//     primaryCta: { label: "مشاهده محصولات", href: "/products" },
//     secondaryCta: { label: "دسته‌بندی‌ها", href: "/categories" },
//   },
//   {
//     id: "special-offer",
//     badge: "پیشنهاد ویژه",
//     title: "تا ۴۰٪ تخفیف روی محصولات منتخب",
//     description: "فرصت محدود — همین امروز خریدت را ثبت کن و از قیمت‌های ویژه استفاده کن.",
//     image: "/images/hero1.webp",
//     imageAlt: "تخفیف ویژه فروشگاه",
//     primaryCta: { label: "مشاهده تخفیف‌ها", href: "/products?discount=true" },
//   },
//   {
//     id: "free-shipping",
//     badge: "ارسال رایگان",
//     title: "ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان",
//     description: "خرید مطمئن با امکان بازگشت کالا، پشتیبانی شبانه‌روزی و پرداخت امن.",
//     image: "/images/hero3.webp",
//     imageAlt: "ارسال رایگان فروشگاه",
//     primaryCta: { label: "شروع خرید", href: "/products" },
//   },
// ];

// /**
//  * بخش Hero صفحه اصلی فروشگاه — یک اسلایدر تبلیغاتی عمومی.
//  *
//  * تمام محتوا (متن، تصویر، دکمه‌ها) از طریق پراپ `slides` کنترل می‌شود؛
//  * هیچ متن یا تصویری مختص یک دسته محصول خاص داخل کامپوننت hardcode
//  * نشده — محتوای پیش‌فرض بالا هم فقط برای زمانی است که این پراپ پاس
//  * داده نشود.
//  *
//  * ویژگی‌ها:
//  *  - چرخش خودکار با توقف هنگام hover/focus و هنگام مخفی بودن تب مرورگر
//  *  - ناوبری دستی با فلش‌ها و نشانگرهای نقطه‌ای
//  *  - پشتیبانی کیبورد (کلیدهای چپ/راست)
//  *  - احترام به prefers-reduced-motion (autoplay غیرفعال می‌شود)
//  *  - کاملاً RTL و ریسپانسیو
//  *
//  * این کامپوننت به‌خاطر state چرخش اسلاید Client Component است؛ در یک
//  * صفحه Server Component (مثل صفحه اصلی فروشگاه) به همین شکل import و
//  * استفاده کنید — نیازی نیست کل صفحه را Client کنید.
//  *
//  * @param {Array<{
//  *   id: string|number,
//  *   badge?: string,
//  *   title: string,
//  *   description?: string,
//  *   image: string,
//  *   imageAlt?: string,
//  *   primaryCta?: { label: string, href: string },
//  *   secondaryCta?: { label: string, href: string },
//  * }>} [slides] - اگر پاس داده نشود از محتوای پیش‌فرض عمومی استفاده می‌شود.
//  * @param {number} [autoPlayInterval] - فاصله چرخش خودکار به میلی‌ثانیه؛
//  *   برای غیرفعال کردن autoplay مقدار 0 بدهید.
//  */
// export function HeroSection({ slides = DEFAULT_SLIDES, autoPlayInterval = AUTO_PLAY_INTERVAL }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
//   const timerRef = useRef(null);

//   const slideCount = slides.length;
//   const hasMultipleSlides = slideCount > 1;

//   // احترام به تنظیمات کاربر برای حرکت کمتر
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setPrefersReducedMotion(mediaQuery.matches);
//     const onChange = (event) => setPrefersReducedMotion(event.matches);
//     mediaQuery.addEventListener("change", onChange);
//     return () => mediaQuery.removeEventListener("change", onChange);
//   }, []);

//   const goTo = useCallback(
//     (index) => {
//       setActiveIndex(((index % slideCount) + slideCount) % slideCount);
//     },
//     [slideCount]
//   );

//   const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
//   const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

//   // چرخش خودکار
//   useEffect(() => {
//     if (!hasMultipleSlides || !autoPlayInterval || isPaused || prefersReducedMotion) {
//       return undefined;
//     }

//     timerRef.current = setInterval(() => {
//       setActiveIndex((current) => (current + 1) % slideCount);
//     }, autoPlayInterval);

//     return () => clearInterval(timerRef.current);
//   }, [hasMultipleSlides, autoPlayInterval, isPaused, prefersReducedMotion, slideCount]);

//   // توقف چرخش وقتی کاربر به تب دیگری می‌رود
//   useEffect(() => {
//     const onVisibilityChange = () => setIsPaused(document.hidden);
//     document.addEventListener("visibilitychange", onVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", onVisibilityChange);
//   }, []);

//   // کلیدهای فیزیکی صفحه‌کلید بر اساس موقعیت واقعی روی صفحه عمل می‌کنند؛
//   // چون دکمه «بعدی» در RTL سمت چپ قرار می‌گیرد، کلید ArrowLeft باید goNext باشد.
//   const handleKeyDown = useCallback(
//     (event) => {
//       if (event.key === "ArrowLeft") {
//         event.preventDefault();
//         goNext();
//       } else if (event.key === "ArrowRight") {
//         event.preventDefault();
//         goPrev();
//       }
//     },
//     [goNext, goPrev]
//   );

//   const activeSlide = slides[activeIndex];

//   return (
//     <section
//       className="relative overflow-hidden border-b bg-muted/30"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//       onFocus={() => setIsPaused(true)}
//       onBlur={() => setIsPaused(false)}
//       onKeyDown={handleKeyDown}
//       role="region"
//       aria-roledescription="carousel"
//       aria-label="پیشنهادهای ویژه فروشگاه"
//     >
//       <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
//         {/* متن — تغییر محتوا با fade نرم */}
//         <div key={activeSlide.id} className="animate-in fade-in-0 slide-in-from-bottom-2 text-center duration-500 lg:text-right">
//           {activeSlide.badge && (
//             <Badge variant="secondary" className="mb-4">
//               {activeSlide.badge}
//             </Badge>
//           )}

//           <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{activeSlide.title}</h1>

//           {activeSlide.description && (
//             <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
//               {activeSlide.description}
//             </p>
//           )}

//           <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
//             {activeSlide.primaryCta && (
//               <Button size="lg" asChild>
//                 <Link href={activeSlide.primaryCta.href}>{activeSlide.primaryCta.label}</Link>
//               </Button>
//             )}
//             {activeSlide.secondaryCta && (
//               <Button size="lg" variant="outline" asChild>
//                 <Link href={activeSlide.secondaryCta.href}>{activeSlide.secondaryCta.label}</Link>
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* تصویر — همه اسلایدها روی هم رندر می‌شوند و فقط opacity عوض می‌شود
//             تا تعویض تصویر هم مثل متن نرم باشد و layout shift نداشته باشد */}
//         <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
//           {slides.map((slide, index) => (
//             <Image
//               key={slide.id}
//               src={slide.image}
//               alt={slide.imageAlt || slide.title}
//               fill
//               priority={index === 0}
//               sizes="(min-width: 1024px) 50vw, 100vw"
//               className={cn(
//                 "object-cover transition-opacity duration-700 ease-in-out",
//                 index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
//               )}
//             />
//           ))}
//         </div>
//       </div>

//       {hasMultipleSlides && (
//         <>
//           {/* فلش قبلی: سمت start (راست در RTL) با آیکون رو به راست */}
//           <button
//             type="button"
//             onClick={goPrev}
//             className="absolute start-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background sm:flex"
//             aria-label="اسلاید قبلی"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>

//           {/* فلش بعدی: سمت end (چپ در RTL) با آیکون رو به چپ */}
//           <button
//             type="button"
//             onClick={goNext}
//             className="absolute end-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background sm:flex"
//             aria-label="اسلاید بعدی"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>

//           {/* نشانگرهای نقطه‌ای */}
//           <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
//             {slides.map((slide, index) => (
//               <button
//                 key={slide.id}
//                 type="button"
//                 onClick={() => goTo(index)}
//                 className={cn(
//                   "h-1.5 rounded-full transition-all",
//                   index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
//                 )}
//                 aria-label={`رفتن به اسلاید ${index + 1}`}
//                 aria-current={index === activeIndex}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </section>
//   );
// }


// components/HeroSlider.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/hero1.webp",
    href: "/products/hero1.webp",
    alt: "پیشنهاد ویژه اول",
    title: "جدیدترین کالکشن پاییزی",
    description: "تا ۴۰٪ تخفیف روی محصولات منتخب، فقط تا پایان هفته",
    cta: "خرید کنید",
  },
  {
    id: 2,
    image: "/images/hero2.jpg",
    href: "/products/offer-2",
    alt: "پیشنهاد ویژه دوم",
    title: "ارسال رایگان سفارش‌ها",
    description: "برای خریدهای بالای ۵۰۰ هزار تومان در سراسر کشور",
    cta: "مشاهده محصولات",
  },
  {
    id: 3,
    image: "/images/hero3.webp",
    href: "/products/offer-3",
    alt: "پیشنهاد ویژه سوم",
    title: "فروش ویژه لحظه‌آخری",
    description: "بهترین قیمت‌ها را از دست ندهید",
    cta: "همین حالا بخر",
  },
];

const AUTOPLAY_DELAY = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);

  const goTo = useCallback((index) => {
    setCurrent((index + slides.length) % slides.length);
    setProgressKey((k) => k + 1); // ری‌ست انیمیشن نوار پیشرفت
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgressKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgressKey((k) => k + 1);
  }, []);

  // اسلاید خودکار (متوقف می‌شود هنگام hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [next, isPaused, current]);

  // ناوبری با کیبورد
  useEffect(() => {
    const handleKey = (e) => {
      // در حالت RTL کلید راست = اسلاید قبلی، چپ = بعدی
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    const node = containerRef.current;
    node?.addEventListener("keydown", handleKey);
    return () => node?.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // مدیریت swipe لمسی
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50; // حداقل فاصله برای تشخیص swipe
    if (deltaX > threshold) {
      // کشیدن به راست → اسلاید قبلی (RTL)
      prev();
    } else if (deltaX < -threshold) {
      next();
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="اسلایدر معرفی محصولات"
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ریل اسلایدها — LTR تا رفتار translate قابل‌پیش‌بینی بماند */}
      <div
        dir="ltr"
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div key={slide.id} className="relative w-full shrink-0">
              <Link
                href={slide.href}
                className="group relative block"
                aria-label={slide.alt}
                dir="rtl"
              >
                <div className="relative h-[320px] w-full sm:h-[420px] md:h-[500px] lg:h-[580px]">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={slide.id === 1}
                    sizes="100vw"
                    className="object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105 motion-reduce:transform-none"
                  />

                  {/* لایه تیره برای خوانایی متن */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                  {/* محتوای روی عکس */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
                      <div className="max-w-xl">
                        <h2
                          className={`text-2xl font-extrabold leading-tight text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-700 ${
                            isActive
                              ? "translate-y-0 opacity-100"
                              : "translate-y-6 opacity-0"
                          }`}
                        >
                          {slide.title}
                        </h2>
                        <p
                          className={`mt-4 text-sm text-slate-100 drop-shadow sm:text-base md:text-lg transition-all delay-100 duration-700 ${
                            isActive
                              ? "translate-y-0 opacity-100"
                              : "translate-y-6 opacity-0"
                          }`}
                        >
                          {slide.description}
                        </p>
                        <span
                          className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition-all delay-200 duration-700 group-hover:bg-sky-700 ${
                            isActive
                              ? "translate-y-0 opacity-100"
                              : "translate-y-6 opacity-0"
                          }`}
                        >
                          {slide.cta}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* دکمه قبلی */}
      <button
        type="button"
        onClick={prev}
        aria-label="اسلاید قبلی"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* دکمه بعدی */}
      <button
        type="button"
        onClick={next}
        aria-label="اسلاید بعدی"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* نقطه‌های ناوبری */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`رفتن به اسلاید ${index + 1}`}
            aria-current={current === index}
            className={`h-2.5 rounded-full transition-all ${
              current === index
                ? "w-7 bg-white"
                : "w-2.5 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>

      {/* نوار پیشرفت زمان اسلاید بعدی */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 z-10 h-1 w-full bg-white/20">
          <div
            key={progressKey}
            className="h-full bg-sky-500 progress-bar"
            style={{ animationDuration: `${AUTOPLAY_DELAY}ms` }}
          />
        </div>
      )}
    </section>
  );
}


