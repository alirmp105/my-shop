import {z} from "zod"

const nameFaSchema = z
    .string()
    .trim()
    .min(2, "نام دسته بندی باید حداقل 2 کاراکتر باشد");

const nameEnSchema = z
    .string()
    .trim()
    .min(2, "نام انگلیسی دسته بندی باید حداقل 2 کاراکتر باشد");

const isActiveSchema = z.boolean();

export const categoryCreateSchema = z.object({
  nameFa: nameFaSchema,
  nameEn: nameEnSchema,
  isActive: isActiveSchema,
  image: z.instanceof(File, { message: "انتخاب تصویر الزامی است" }),
});

export const categoryUpdateSchema = z.object({
  nameFa: nameFaSchema,
  nameEn: nameEnSchema,
  isActive: isActiveSchema,
  image: z.instanceof(File).optional(),
});