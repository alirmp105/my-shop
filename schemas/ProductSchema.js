// validations/productValidation.js

import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "نام محصول باید حداقل ۳ کاراکتر باشد")
    .trim(),

  slug: z
    .string()
    .min(3, "Slug باید حداقل ۳ کاراکتر باشد")
    .trim(),

  description: z
    .string()
    .max(5000, "توضیحات خیلی طولانی است")
    .default(""),

  price: z.coerce
    .number()
    .min(1, "قیمت باید حداقل ۱ باشد"),

  stock: z.coerce
    .number()
    .int("موجودی باید عدد صحیح باشد")
    .min(0, "موجودی نمی‌تواند منفی باشد"),

  category: z
    .string()
    .min(1, "انتخاب دسته‌بندی الزامی است"),
});