// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Animated Gradient Blob */}
        <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-linear-to-tr from-violet-600/30 via-transparent to-cyan-500/30 blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:` linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Error Code */}
        <div className="relative mb-8 select-none">
          <span className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-zinc-800">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-zinc-200 via-zinc-400 to-zinc-600 opacity-40">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">
          صفحه پیدا نشد
        </h1>

        {/* Description */}
        <p className="max-w-md text-sm md:text-base text-zinc-400 leading-relaxed mb-8">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد، جابه‌جا شده یا به آدرس دیگری منتقل شده است.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-zinc-200 transition-all duration-300 hover:bg-zinc-800 hover:scale-105 active:scale-95 border border-zinc-800 hover:border-zinc-700"
        >
          <svg 
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          بازگشت به خانه
        </Link>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-zinc-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse" />
        <span>خطای ۴۰۴</span>
      </div>
    </div>
  );
}