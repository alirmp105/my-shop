import {z} from "zod"

export const brandCreateSchema = z.object({
  nameFa: z
    .string()
    .trim()
    .min(2, "نام دسته بندی باید حداقل 3 کاراکتر باشد"),
  nameEn: z
    .string()
    .trim()
    .min(2, "نام دسته بندی باید حداقل 3 کاراکتر باشد"),

  slug: z
    .string()
    .trim()
    .min(2, "اسلاگ الزامی است"),

  image: z
  .instanceof(File, {message : "انتخاب تصویر الزامی است"})
});


export const brandUpdateSchema = z.object({
  nameFa: z
    .string()
    .trim()
    .min(2, "نام دسته بندی باید حداقل 3 کاراکتر باشد"),
  nameEn: z
    .string()
    .trim()
    .min(2, "نام دسته بندی باید حداقل 3 کاراکتر باشد"),
  slug: z
    .string()
    .trim()
    .min(2, "اسلاگ الزامی است"),

  image: z.instanceof(File).optional(),
});