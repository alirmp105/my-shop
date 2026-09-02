
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/banner1.jpg",
    href: "/products/offer-1",
    alt: "پیشنهاد ویژه اول",
    title: "جدیدترین کالکشن پاییزی",
    description: "تا ۴۰٪ تخفیف روی محصولات منتخب، فقط تا پایان هفته",
    cta: "خرید کنید",
  },
  {
    id: 2,
    image: "/images/banner2.jpg",
    href: "/products/offer-2",
    alt: "پیشنهاد ویژه دوم",
    title: "ارسال رایگان سفارش‌ها",
    description: "برای خریدهای بالای ۵۰۰ هزار تومان در سراسر کشور",
    cta: "مشاهده محصولات",
  },
  {
    id: 3,
    image: "/images/banner3.jpg",
    href: "/products/offer-3",
    alt: "پیشنهاد ویژه سوم",
    title: "فروش ویژه لحظه‌آخری",
    description: "بهترین قیمت‌ها را از دست ندهید",
    cta: "همین حالا بخر",
  },
];

const AUTOPLAY_DELAY = 3000;

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



  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50; 
    if (deltaX > threshold) {
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
                <div className="relative h-80 w-full sm:h-105 md:h-125 lg:h-145">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={slide.id === 1}
                    sizes="100vw"
                    className="object-cover transition-transform duration-6000 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  />

                  {/* لایه تیره برای خوانایی متن */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />

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


