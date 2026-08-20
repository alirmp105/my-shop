import {z} from "zod"

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "نام دسته بندی باید حداقل 3 کاراکتر باشد"),

  slug: z
    .string()
    .trim()
    .min(3, "اسلاگ الزامی است"),

  image: z
  .instanceof(File, {message : "انتخاب تصویر الزامی است"})
});


export const categoryUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "نام دسته بندی باید حداقل 3 کاراکتر باشد"),

  slug: z
    .string()
    .trim()
    .min(3, "اسلاگ الزامی است"),

  image: z.instanceof(File).optional(),
});