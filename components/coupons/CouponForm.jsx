"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { couponSchema } from "@/schemas/coupon";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";

const CouponForm = ({ mode, coupon }) => {
  const router = useRouter();

  const isEdit = mode === "edit";

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(couponSchema),

    defaultValues: {
      code: coupon?.code || "",

      type: coupon?.type || "percentage",

      value: coupon?.value ?? "hi",

      minPurchase: coupon?.minPurchase ?? "",

      maxDiscount: coupon?.maxDiscount ?? null,

      usageLimit: coupon?.usageLimit ?? null,

      expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt) : null,

      isActive: coupon?.isActive ?? true,
    },
  });

  const selectedType = form.watch("type");

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/coupons/${coupon._id}` : "/api/coupons";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        
      });
 console.log("res :  ", res);
      const result = await res.json();
      console.log("result :  ", result);
      if (res.status === 201) {
        toast.success("کد تخفیف ایجاد شد", {
          position: "top-center",
        });

        router.push("/admin/coupon");
        return;
      }

      if (res.status === 200) {
        toast.success("کد تخفیف ویرایش شد", {
          position: "top-center",
        });

        router.push("/admin/coupon");
        return;
      }

      if (res.status === 409) {
        setServerError(result.message || "این کد تخفیف قبلاً ثبت شده است.");

        return;
      }

      if (!res.ok) {
        setServerError(
          result.message || "خطایی رخ داد، لطفاً دوباره تلاش کنید.",
        );

        return;
      }
    } catch (error) {
      console.error(error);

      setServerError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-center">
          {isEdit ? "ویرایش کد تخفیف" : "ایجاد کد تخفیف"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form id="coupon-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* ========================= */}
            {/* Code */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>کد تخفیف:</FieldLabel>

                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    placeholder="مثلاً SUMMER20"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Type */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>نوع تخفیف:</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="نوع تخفیف" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="percentage">درصدی</SelectItem>

                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Value */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="value"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {selectedType === "percentage"
                      ? "درصد تخفیف:"
                      : "مبلغ تخفیف:"}
                  </FieldLabel>

                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    min="0"
                    placeholder={
                      selectedType === "percentage" ? "مثلاً 20" : "مثلاً 50000"
                    }
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Minimum Purchase */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="minPurchase"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>حداقل مبلغ خرید:</FieldLabel>

                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    min="0"
                    placeholder="مثلاً 500000"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Max Discount */}
            {/* فقط برای percentage */}
            {/* ========================= */}

            {selectedType === "percentage" && (
              <Controller
                control={form.control}
                name="maxDiscount"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>حداکثر مبلغ تخفیف:</FieldLabel>

                    <Input
                      type="number"
                      min="0"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        field.onChange(value === "" ? null : Number(value));
                      }}
                      placeholder="مثلاً 100000"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {/* ========================= */}
            {/* Usage Limit */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="usageLimit"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>محدودیت تعداد استفاده:</FieldLabel>

                  <Input
                    type="number"
                    min="1"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      field.onChange(value === "" ? null : Number(value));
                    }}
                    placeholder="مثلاً 100"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Expiration Date */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="expiresAt"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>تاریخ انقضا:</FieldLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon />

                        {field.value
                          ? format(field.value, "yyyy/MM/dd")
                          : "انتخاب تاریخ"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Active */}
            {/* ========================= */}

            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  <FieldLabel>کد تخفیف فعال باشد</FieldLabel>
                </Field>
              )}
            />

            {/* ========================= */}
            {/* Server Error */}
            {/* ========================= */}

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          بازنشانی
        </Button>

        <Button type="submit" form="coupon-form" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}

          {isEdit ? "ذخیره تغییرات" : "ایجاد کد تخفیف"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CouponForm;
