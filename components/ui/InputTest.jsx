"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, icon: Icon, error, type = "text", ...rest },
  ref
) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-plum-800">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-plum-700/50">
            <Icon size={18} strokeWidth={1.75} />
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full rounded-xl border bg-white/70 py-2.5 pl-3 text-sm text-plum-900 placeholder:text-plum-700/40 outline-none transition focus:bg-white focus:ring-2 ${
            Icon ? "pr-10" : "pr-3"
          } ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-plum-700/15 focus:border-gold-500 focus:ring-gold-500/25"
          }`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
