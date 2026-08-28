
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, AlertCircle } from "lucide-react";

import Input from "@/components/ui/InputTest";
import PasswordInput from "@/components/auth/PasswordInput";
import {Button} from "@/components/ui/button";
import BrandPanel from "@/components/auth/BrandPanel";
import { loginSchema } from "@/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const denied = searchParams.get("denied");

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-plum-950 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-plum-950 shadow-soft">
        <BrandPanel
          eyebrow="پنل ورود امن"
          title="خوش برگشتی. حساب‌ت همون‌جاست که گذاشتیش."
          description="با ایمیل و رمز عبور وارد شو و به داشبورد اختصاصی خودت دسترسی پیدا کن. نشست تو با JWT رمزنگاری و از سمت سرور اعتبارسنجی می‌شود."
        />

        <div className="flex w-full flex-col justify-center bg-plum-50/[0.04] p-8 md:w-1/2 md:bg-white md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-plum-900">ورود به حساب</h2>
            <p className="mt-1.5 text-sm text-plum-700/60">
              حساب نداری؟{" "}
              <Link
                href="/register"
                className="font-medium text-gold-600 hover:underline"
              >
                همین‌جا بساز
              </Link>
            </p>
          </div>

          {denied && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              <AlertCircle size={16} />
              <span>برای دسترسی به آن صفحه باید نقش ادمین داشته باشی.</span>
            </div>
          )}

          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-600">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="ایمیل"
              type="email"
              icon={Mail}
              placeholder="example@mail.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <PasswordInput
              label="رمز عبور"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-plum-700/70">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-plum-700/30 text-gold-600 focus:ring-gold-500/40"
                  {...register("remember")}
                />
                مرا به خاطر بسپار
              </label>
              <Link
                href="#"
                className="font-medium text-plum-700/70 hover:text-gold-600"
              >
                رمز عبور را فراموش کرده‌ای؟
              </Link>
            </div>

            <Button type="submit">
              ورود
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
