// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Loader2,
//   Lock,
//   LogIn,
//   Mail,
// } from "lucide-react";

// import { toast } from "sonner";

// import { loginSchema } from "@/schemas/auth";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";

// const LoginForm = () => {
//   const router = useRouter();

//   const [serverError, setServerError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(loginSchema),

//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     setServerError("");
//     setIsSubmitting(true);

//     try {
//       const result = await signIn(
//         "credentials",
//         {
//           email: data.email,
//           password: data.password,
//           redirect: false,
//         }
//       );

//       console.log("LOGIN RESULT:", result);

//       if (result?.error) {
//         setServerError(
//           "ایمیل یا رمز عبور اشتباه است."
//         );

//         return;
//       }

//       toast.success(
//         "با موفقیت وارد شدید.",
//         {
//           position: "top-center",
//         }
//       );

//       router.push("/");

//       router.refresh();
//     } catch (error) {
//       console.error(
//         "LOGIN ERROR:",
//         error
//       );

//       setServerError(
//         "خطایی هنگام ورود رخ داد. دوباره تلاش کنید."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="text-center">
//           ورود به حساب کاربری
//         </CardTitle>

//         <CardDescription className="text-center">
//           ایمیل و رمز عبور خود را وارد کنید.
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form
//           id="login-form"
//           onSubmit={form.handleSubmit(onSubmit)}
//         >
//           <FieldGroup>

//             {/* Email */}
//             <Field
//               data-invalid={
//                 !!form.formState.errors.email
//               }
//             >
//               <FieldLabel htmlFor="email">
//                 ایمیل
//               </FieldLabel>

//               <div className="relative">
//                 <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="email"
//                   type="email"
//                   {...form.register("email")}
//                   className="pr-10"
//                   placeholder="example@email.com"
//                   autoComplete="email"
//                   dir="ltr"
//                   disabled={isSubmitting}
//                   aria-invalid={
//                     !!form.formState.errors.email
//                   }
//                 />
//               </div>

//               {form.formState.errors.email && (
//                 <FieldError
//                   errors={[
//                     form.formState.errors.email,
//                   ]}
//                 />
//               )}
//             </Field>

//             {/* Password */}
//             <Field
//               data-invalid={
//                 !!form.formState.errors.password
//               }
//             >
//               <FieldLabel htmlFor="password">
//                 رمز عبور
//               </FieldLabel>

//               <div className="relative">
//                 <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   type="password"
//                   {...form.register("password")}
//                   className="pr-10"
//                   placeholder="رمز عبور"
//                   autoComplete="current-password"
//                   dir="ltr"
//                   disabled={isSubmitting}
//                   aria-invalid={
//                     !!form.formState.errors.password
//                   }
//                 />
//               </div>

//               {form.formState.errors.password && (
//                 <FieldError
//                   errors={[
//                     form.formState.errors.password,
//                   ]}
//                 />
//               )}
//             </Field>

//             {/* Server Error */}
//             {serverError && (
//               <p className="text-sm text-destructive text-center">
//                 {serverError}
//               </p>
//             )}

//           </FieldGroup>
//         </form>
//       </CardContent>

//       <CardFooter>
//         <Button
//           type="submit"
//           form="login-form"
//           className="w-full"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <Loader2 className="animate-spin" />
//           ) : (
//             <LogIn />
//           )}

//           {isSubmitting
//             ? "در حال ورود..."
//             : "ورود"}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default LoginForm;


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
