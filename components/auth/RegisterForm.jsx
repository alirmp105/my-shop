"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { registerSchema } from "@/schemas/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const RegisterForm = () => {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

 const onSubmit = async (data) => {
  setServerError("");
  setIsSubmitting(true);

  try {
    // ثبت نام
    const registerResponse = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await registerResponse.json();

    if (!registerResponse.ok) {
      if (result.errors) {
        Object.entries(result.errors).forEach(
          ([field, messages]) => {
            form.setError(field, {
              type: "server",
              message: messages?.[0],
            });
          }
        );
      }

      setServerError(
        result.message || "ثبت‌نام انجام نشد."
      );

      return;
    }

    // Login خودکار
    const loginResult = await signIn(
      "credentials",
      {
        email: data.email,
        password: data.password,
        redirect: false,
      }
    );

    if (loginResult?.error) {
      console.error(
        "LOGIN ERROR:",
        loginResult.error
      );

      toast.error(
        "ثبت‌نام انجام شد اما ورود خودکار انجام نشد."
      );

      router.push("/login");

      return;
    }

    toast.success(
      "ثبت‌نام و ورود با موفقیت انجام شد.",
      {
        position: "top-center",
      }
    );

    router.push("/");

    router.refresh();
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    setServerError(
      "ارتباط با سرور برقرار نشد."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          ایجاد حساب کاربری
        </CardTitle>

        <CardDescription className="text-center">
          برای ایجاد حساب اطلاعات خود را وارد کنید.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>

            {/* Name */}
            <Field
              data-invalid={
                !!form.formState.errors.name
              }
            >
              <FieldLabel htmlFor="name">
                نام
              </FieldLabel>

              <div className="relative">
                <User className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  {...form.register("name")}
                  className="pr-10"
                  placeholder="نام شما"
                  autoComplete="name"
                  disabled={isSubmitting}
                  aria-invalid={
                    !!form.formState.errors.name
                  }
                />
              </div>

              {form.formState.errors.name && (
                <FieldError
                  errors={[
                    form.formState.errors.name,
                  ]}
                />
              )}
            </Field>

            {/* Email */}
            <Field
              data-invalid={
                !!form.formState.errors.email
              }
            >
              <FieldLabel htmlFor="email">
                ایمیل
              </FieldLabel>

              <div className="relative">
                <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="pr-10"
                  placeholder="example@email.com"
                  autoComplete="email"
                  dir="ltr"
                  disabled={isSubmitting}
                  aria-invalid={
                    !!form.formState.errors.email
                  }
                />
              </div>

              {form.formState.errors.email && (
                <FieldError
                  errors={[
                    form.formState.errors.email,
                  ]}
                />
              )}
            </Field>

            {/* Password */}
            <Field
              data-invalid={
                !!form.formState.errors.password
              }
            >
              <FieldLabel htmlFor="password">
                رمز عبور
              </FieldLabel>

              <div className="relative">
                <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="pr-10"
                  placeholder="حداقل ۸ کاراکتر"
                  autoComplete="new-password"
                  dir="ltr"
                  disabled={isSubmitting}
                  aria-invalid={
                    !!form.formState.errors.password
                  }
                />
              </div>

              {form.formState.errors.password && (
                <FieldError
                  errors={[
                    form.formState.errors.password,
                  ]}
                />
              )}
            </Field>

            {/* Confirm Password */}
            <Field
              data-invalid={
                !!form.formState.errors.confirmPassword
              }
            >
              <FieldLabel htmlFor="confirmPassword">
                تکرار رمز عبور
              </FieldLabel>

              <div className="relative">
                <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  className="pr-10"
                  placeholder="رمز عبور را دوباره وارد کنید"
                  autoComplete="new-password"
                  dir="ltr"
                  disabled={isSubmitting}
                  aria-invalid={
                    !!form.formState.errors.confirmPassword
                  }
                />
              </div>

              {form.formState.errors.confirmPassword && (
                <FieldError
                  errors={[
                    form.formState.errors.confirmPassword,
                  ]}
                />
              )}
            </Field>
            {/* Server Error */}
            {serverError && (
              <p className="text-sm text-destructive text-center">
                {serverError}
              </p>
            )}

          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          form="register-form"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <UserPlus />
          )}

          {isSubmitting
            ? "در حال ثبت‌نام..."
            : "ایجاد حساب کاربری"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;