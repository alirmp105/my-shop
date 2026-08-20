export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, "امتیاز الزامی است")
    .max(5, "امتیاز باید حداکثر 5 باشد"),

  title: z
    .string()
    .max(100, "عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
    comment :
    z.string()
    .trim()
    .min(10,"متن نظر باید حداقل 20 کاراکتر باشد")
    .max(500, "متن نظر بیش از حد طولانی است!")
});
