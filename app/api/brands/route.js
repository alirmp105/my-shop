import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { brandCreateSchema } from "@/schemas/brandSchema";
import path from "path";
import fs from "fs/promises";
// export async function GET() {
//   try {
//     await connectDB();
//     console.log(connectDB);

//     const categories = await brand.find().sort({ createdAt: -1 });
//     console.log(categories);

//     return NextResponse.json(
//       categories.map((brand) => ({
//         id: brand._id.toString(),
//         name: brand.name,
//         image : brand.image,

//         // createdAt: brand.createdAt,
//       })),
//     );
//   } catch (error) {
//     console.error("error msg :", error);
//     return NextResponse.json(
//       { message: "failed to fetch brand" },
//       { status: 500 },
//     );
//   }
// }

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const nameFa = formData.get("nameFa");
    const nameEn = formData.get("nameEn");
    const slug = formData.get("slug");
    const image = formData.get("image");

    // بررسی اولیه فایل
    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "تصویر دسته بندی الزامی است" },
        { status: 400 },
      );
    }
    // file vaildation :

    // تبدیل اطلاعات FormData برای Zod
    const validation = brandCreateSchema.safeParse({
      nameFa,
      nameEn,
      slug,
      image,
    });
    console.log("validation : ", validation);
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          message: "فرمت یکی از تصاویر مجاز نیست.",
        },
        { status: 400 },
      );
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "حجم هر تصویر نباید بیشتر از 5MB باشد.",
        },
        { status: 400 },
      );
    }
    console.log("validation data : ", validation.data);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "اطلاعات وارد شده صحیح نیست",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // بررسی تکراری بودن slug
    const existingbrand = await Brand.findOne({ slug });

    if (existingbrand) {
      return NextResponse.json(
        { message: "این دسته بندی وجود دارد" },
        { status: 409 },
      );
    }

    // مسیر ذخیره تصاویر
    const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");

    await fs.mkdir(uploadDir, { recursive: true });

    // نام یکتا برای فایل
    const extension = path.extname(image.name);
    const fileName = `${crypto.randomUUID()}${extension}`;

    const filePath = path.join(uploadDir, fileName);

    // تبدیل File به Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ذخیره فایل
    await fs.writeFile(filePath, buffer);

    // URL قابل استفاده در Frontend
    const imageUrl = `/uploads/brands/${fileName}`;

    // ایجاد brand
    const brand = await Brand.create({
      nameFa,
      nameEn,
      slug,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        message: "دسته بندی با موفقیت ایجاد شد",
        brand,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE brand ERROR:", error);

    return NextResponse.json(
      { message: "خطایی در ایجاد دسته بندی رخ داد" },
      { status: 500 },
    );
  }
}
