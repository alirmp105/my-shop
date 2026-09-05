"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Mail, AlertCircle, Loader2, LogIn } from "lucide-react";

import Input from "@/components/auth/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import BrandPanel from "@/components/auth/BrandPanel";
import { loginSchema } from "@/schemas/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const denied = searchParams.get("denied");

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogining, setIsLogining] = useState(false);
  const session = useSession()
  if(session.status === "authenticated"){
    router.push("/profile")
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setIsLogining(true);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      toast.success("ورود با موفقیت انجام شد", {
        position: "top-center",
      });

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("login error : ", error);
    } finally {
      setIsLogining(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-plum-950 p-4 ">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-plum-950 shadow-soft border">
        <BrandPanel
          eyebrow="لورم ایپسوم"
          title="خوش برگشتی. حساب‌ت همون‌جاست که گذاشتیش."
          description="با ایمیل و رمز عبور وارد شو و به داشبورد اختصاصی خودت دسترسی داشته باش."
        />

        <div className="flex w-full flex-col justify-center bg-plum-50/[0.04] p-8 md:w-1/2 md:bg-white md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-plum-900">ورود به حساب</h2>
            <p className="mt-1.5 text-sm text-plum-700/60">
              حساب نداری؟{" "}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="font-medium text-sky-600 hover:underline"
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
              dir="ltr"
            />

            <PasswordInput
              label="رمز عبور"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
              dir="ltr"
            />

            <div className="flex items-center justify-between text-xs">
              <Link
                href="/forgot"
                className="font-medium text-sky-700/70 hover:text-sky-600"
              >
                رمز عبور را فراموش کرده‌ای؟
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer hover:bg-black/70"
              disabled={isLogining}
            >
              {isLogining ? <Loader2 className="animate-spin" /> : <LogIn />}
              {isLogining ? "درحال ورود" : "ورود"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
