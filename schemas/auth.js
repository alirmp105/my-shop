import z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(100, "نام بیش از حد طولانی است"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("ایمیل معتبر نیست"),

  password: z
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .max(100, "رمز عبور بیش از حد طولانی است"),

  confirmPassword: z
    .string()
    .min(1, "تکرار رمز عبور الزامی است"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "رمزهای عبور یکسان نیستند",
    path: ["confirmPassword"],
  }
);


export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("ایمیل معتبر نیست"),

  password: z
    .string()
    .min(1, "رمز عبور الزامی است"),
});