import z from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "کد تخفیف باید حداقل 3 کاراکتر باشد")
      .max(50, "کد تخفیف بیش از حد طولانی است")
      .transform((value) => value.toUpperCase()),

    type: z.enum(
      ["percentage", "fixed"],
      {
        message: "نوع تخفیف معتبر نیست",
      }
    ),

    value: z.coerce
      .number()
      .positive("مقدار تخفیف باید بیشتر از صفر باشد"),

    minPurchase: z.coerce
      .number()
      .min(0)
      .default(0),

    maxDiscount: z.coerce
      .number()
      .positive()
      .nullable()
      .optional(),

    usageLimit: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

    expiresAt: z
      .coerce
      .date()
      .nullable()
      .optional(),

    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "percentage" &&
      data.value > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message:
          "درصد تخفیف نمی‌تواند بیشتر از 100 باشد",
      });
    }

    if (
      data.maxDiscount !== null &&
      data.maxDiscount !== undefined &&
      data.type === "fixed"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxDiscount"],
        message:
          "حداکثر تخفیف فقط برای تخفیف درصدی استفاده می‌شود",
      });
    }
  });