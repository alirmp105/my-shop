import { z } from "zod";

const optionalDate = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.date().optional(),
);

const baseFields = {
  title: z.string().trim().min(2, "عنوان حداقل باید ۲ کاراکتر باشد"),
  subtitle: z.string().trim().min(2, "زیرعنوان حداقل باید ۲ کاراکتر باشد"),
  buttonText: z.string().trim().min(1, "متن دکمه الزامی است"),
  buttonHref: z.string().trim().min(1, "لینک دکمه الزامی است"),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  startAt: optionalDate,
  endAt: optionalDate,
};

const withDateValidation = (schema) =>
  schema.refine(
    (data) => !data.startAt || !data.endAt || data.endAt >= data.startAt,
    { message: "زمان پایان باید بعد از زمان شروع باشد", path: ["endAt"] },
  );

export const heroCreateSchema = withDateValidation(
  z.object({ ...baseFields, image: z.instanceof(File, { message: "تصویر الزامی است" }) }),
);

export const heroUpdateSchema = withDateValidation(
  z.object({ ...baseFields, image: z.instanceof(File).optional() }),
);
