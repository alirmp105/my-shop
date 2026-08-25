"use client";

import { forwardRef, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, ...rest },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-plum-800">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-plum-700/50">
          <Lock size={18} strokeWidth={1.75} />
        </span>
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={`w-full rounded-xl border bg-white/70 py-2.5 pl-10 pr-10 text-sm text-plum-900 placeholder:text-plum-700/40 outline-none transition focus:bg-white focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-plum-700/15 focus:border-gold-500 focus:ring-gold-500/25"
          }`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 left-3 flex items-center text-plum-700/50 hover:text-plum-800"
          tabIndex={-1}
          aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.75} />
          ) : (
            <Eye size={18} strokeWidth={1.75} />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default PasswordInput;
