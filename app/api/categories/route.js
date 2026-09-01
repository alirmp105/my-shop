import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryCreateSchema } from "@/schemas/categorySchema";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

function parseBoolean(value) {
  return value === true || value === "true";
}

function createSlug(value) {
  return value.trim().replace(/\s+/g, "-");
}

function extensionForType(type) {
  return type === "image/jpeg" ? ".jpg" : type === "image/png" ? ".png" : ".webp";
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(categories.map((category) => ({
      _id: category._id.toString(),
      nameFa: category.nameFa || category.name || "",
      nameEn: category.nameEn || "",
      slug: category.slug,
      image: category.image,
      isActive: category.isActive ?? true,
    })));
  } catch (error) {
    console.error("GET /api/categories:", error);
    return NextResponse.json({ message: "خطا در دریافت دسته بندی ها" }, { status: 500 });
  }
}

export async function POST(request) {
  let uploadedFilePath = null;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const formData = await request.formData();
    const image = formData.get("image");
    const validation = categoryCreateSchema.safeParse({
      nameFa: formData.get("nameFa"),
      nameEn: formData.get("nameEn"),
      image,
      isActive: parseBoolean(formData.get("isActive")),
    });

    if (!validation.success) {
      return NextResponse.json({
        message: "اطلاعات وارد شده صحیح نیست",
        errors: validation.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ message: "فرمت تصویر مجاز نیست" }, { status: 400 });
    }
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "حجم تصویر نباید بیشتر از 5 مگابایت باشد" }, { status: 400 });
    }

    const slug = createSlug(validation.data.nameEn);
    if (await Category.exists({ slug })) {
      return NextResponse.json({ message: "دسته بندی با این slug قبلاً ایجاد شده است" }, { status: 409 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${crypto.randomUUID()}${extensionForType(image.type)}`;
    uploadedFilePath = path.join(uploadDir, fileName);
    await fs.writeFile(uploadedFilePath, Buffer.from(await image.arrayBuffer()));

    const category = await Category.create({
      nameFa: validation.data.nameFa,
      nameEn: validation.data.nameEn,
      slug,
      image: `/uploads/categories/${fileName}`,
      isActive: validation.data.isActive,
    });

    return NextResponse.json({ message: "دسته بندی با موفقیت ایجاد شد", category }, { status: 201 });
  } catch (error) {
    if (uploadedFilePath) {
      await fs.unlink(uploadedFilePath).catch((cleanupError) => {
        console.error("CREATE category image cleanup error:", cleanupError);
      });
    }
    console.error("POST /api/categories:", error);
    return NextResponse.json({ message: "خطایی در ایجاد دسته بندی رخ داد" }, { status: 500 });
  }
}
