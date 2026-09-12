"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_DELAY = 3000;

export default function HeroCarousel({ heroes = [] }) {
  const slides = heroes.length ? heroes : null;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStart = useRef(null);
  const goTo = useCallback(
    (index) => {
      setCurrent((index + slides.length) % slides.length);
      setProgressKey((key) => key + 1);
    },
    [slides.length],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [next, paused, slides.length]);
  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="اسلایدهای معرفی محصولات"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (delta > 50) prev();
        else if (delta < -50) next();
        touchStart.current = null;
      }}
    >
      <div
        dir="ltr"
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide._id || index} className="relative w-full shrink-0">
            <Link
              href={slide.button?.href || "#"}
              className="group relative block"
              dir="rtl"
            >
              <div className="relative h-80 w-full sm:h-105 md:h-125 lg:h-145">
                <Image
                  src={slide.image?.url || slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
                    <div className="max-w-xl">
                      <h2
                        className={`text-2xl font-extrabold leading-tight text-white drop-shadow-md transition-all duration-700 sm:text-3xl md:text-4xl lg:text-5xl ${index === current ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                      >
                        {slide.title}
                      </h2>
                      <p
                        className={`mt-4 text-sm text-slate-100 drop-shadow transition-all delay-100 duration-700 sm:text-base md:text-lg ${index === current ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                      >
                        {slide.subtitle}
                      </p>
                      <span
                        className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all delay-200 duration-700 group-hover:bg-sky-700 ${index === current ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                      >
                        {slide.button?.text || "مشاهده"}
                        <span aria-hidden="true">←</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="اسلاید قبلی"
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow-md backdrop-blur hover:bg-white"
          >
            ›
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="اسلاید بعدی"
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow-md backdrop-blur hover:bg-white"
          >
            ‹
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide._id || index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`رفتن به اسلاید ${index + 1}`}
                aria-current={current === index}
                className={`h-2.5 rounded-full transition-all ${current === index ? "w-7 bg-white" : "w-2.5 bg-white/60"}`}
              />
            ))}
          </div>
          {!paused && (
            <div className="absolute bottom-0 left-0 z-10 h-1 w-full bg-white/20">
              <div
                key={progressKey}
                className="progress-bar h-full bg-sky-500"
                style={{ animationDuration: `${AUTOPLAY_DELAY}ms` }}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
