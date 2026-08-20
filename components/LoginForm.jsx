"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";

import { toast } from "sonner";

import { loginSchema } from "@/schemas/auth";

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

const LoginForm = () => {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const result = await signIn(
        "credentials",
        {
          email: data.email,
          password: data.password,
          redirect: false,
        }
      );

      console.log("LOGIN RESULT:", result);

      if (result?.error) {
        setServerError(
          "ایمیل یا رمز عبور اشتباه است."
        );

        return;
      }

      toast.success(
        "با موفقیت وارد شدید.",
        {
          position: "top-center",
        }
      );

      router.push("/");

      router.refresh();
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setServerError(
        "خطایی هنگام ورود رخ داد. دوباره تلاش کنید."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          ورود به حساب کاربری
        </CardTitle>

        <CardDescription className="text-center">
          ایمیل و رمز عبور خود را وارد کنید.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>

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
                  placeholder="رمز عبور"
                  autoComplete="current-password"
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
          form="login-form"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogIn />
          )}

          {isSubmitting
            ? "در حال ورود..."
            : "ورود"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;