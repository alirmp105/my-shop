import { ShieldCheck } from "lucide-react";

export default function BrandPanel({ eyebrow, title, description }) {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-plum-950 p-10 text-gold-400 md:flex bg-neutral-800 text-white">
      <div className="brand-dotgrid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative flex items-center gap-2 text-sm text-gold-400/80">
        <ShieldCheck size={20} strokeWidth={1.75} />
        <span>{eyebrow}</span>
      </div>

      <div className="relative space-y-4">
        <div className="h-px w-12 bg-gold-500/60" />
        <h1 className="max-w-xs text-3xl font-bold leading-snug text-white">
          {title}
        </h1>
        <p className="max-w-sm text-sm leading-7 text-gold-400/70">
          {description}
        </p>
      </div>

      <p className="relative text-xs text-gold-400/50">
       لورم ایپسوم
      </p>
    </div>
  );
}
