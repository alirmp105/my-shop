import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { brandCreateSchema } from "@/schemas/brandSchema";
import path from "path";
import fs from "fs/promises";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

function extensionForType(type) {
  return type === "image/jpeg"
    ? ".jpg"
    : type === "image/png"
      ? ".png"
      : ".webp";
}

export async function POST(request) {
  let uploadedFilePath = null;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
    }

    await connectDB();

    const formData = await request.formData();

    const nameFa = formData.get("nameFa");
    const nameEn = formData.get("nameEn");
    const slug = formData.get("slug");
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "تصویر برند الزامی است" },
        { status: 400 },
      );
    }

    const validation = brandCreateSchema.safeParse({
      nameFa,
      nameEn,
      slug,
      image,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "اطلاعات وارد شده صحیح نیست",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          message: "فرمت تصویر برند مجاز نیست.",
        },
        { status: 400 },
      );
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "حجم تصویر برند نباید بیشتر از 5MB باشد.",
        },
        { status: 400 },
      );
    }

    const existingBrand = await Brand.findOne({ slug });

    if (existingBrand) {
      return NextResponse.json(
        { message: "این برند وجود دارد" },
        { status: 409 },
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "brands",
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const extension = extensionForType(image.type);
    const fileName = `${crypto.randomUUID()}${extension}`;

    uploadedFilePath = path.join(uploadDir, fileName);

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(uploadedFilePath, buffer);

    const imageUrl = `/uploads/brands/${fileName}`;

    const brand = await Brand.create({
      nameFa,
      nameEn,
      slug,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        message: "برند با موفقیت ایجاد شد",
        brand,
      },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedFilePath) {
      await fs.unlink(uploadedFilePath).catch((cleanupError) => {
        console.error(
          "CREATE brand image cleanup error:",
          cleanupError,
        );
      });
    }

    console.error("CREATE brand ERROR:", error);

    return NextResponse.json(
      { message: "خطایی در ایجاد برند رخ داد" },
      { status: 500 },
    );
  }
}
