import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categoryUpdateSchema } from "@/schemas/categorySchema";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

function extensionForType(type) {
  return type === "image/jpeg" ? ".jpg" : type === "image/png" ? ".png" : ".webp";
}

function parseBoolean(value) {
  return value === true || value === "true";
}

function getCategoryImagePath(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/categories/")) {
    return null;
  }

  const uploadDirectory = path.resolve(process.cwd(), "public", "uploads", "categories");
  const resolvedPath = path.resolve(process.cwd(), "public", imageUrl.slice(1));
  return resolvedPath.startsWith(`${uploadDirectory}${path.sep}`) ? resolvedPath : null;
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "شناسه دسته بندی معتبر نیست" }, { status: 400 });
  }

  try {
    await connectDB();
    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json({ message: "دسته بندی پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({
      _id: category._id.toString(),
      nameFa: category.nameFa || category.name || "",
      nameEn: category.nameEn || "",
      slug: category.slug,
      image: category.image,
      isActive: category.isActive ?? true,
    });
  } catch (error) {
    console.error("GET /api/categories/[id]:", error);
    return NextResponse.json({ message: "خطا در دریافت دسته بندی" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "شناسه دسته بندی معتبر نیست" }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "دسته بندی پیدا نشد" }, { status: 404 });
    }

    const formData = await request.formData();
    const image = formData.get("image");
    const newImage = image instanceof File && image.size > 0 ? image : undefined;
    const validation = categoryUpdateSchema.safeParse({
      nameFa: formData.get("nameFa"),
      nameEn: formData.get("nameEn"),
      image: newImage,
      isActive: parseBoolean(formData.get("isActive")),
    });

    if (!validation.success) {
      return NextResponse.json({
        message: "اطلاعات وارد شده صحیح نیست",
        errors: validation.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const oldImageUrl = category.image;
    let imageUrl = oldImageUrl;

    if (newImage) {
      if (!allowedTypes.includes(newImage.type)) {
        return NextResponse.json({ message: "فرمت تصویر مجاز نیست" }, { status: 400 });
      }
      if (newImage.size > MAX_FILE_SIZE) {
        return NextResponse.json({ message: "حجم تصویر نباید بیشتر از 5 مگابایت باشد" }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `${crypto.randomUUID()}${extensionForType(newImage.type)}`;
      uploadedFilePath = path.join(uploadDir, fileName);
      await fs.writeFile(uploadedFilePath, Buffer.from(await newImage.arrayBuffer()));
      imageUrl = `/uploads/categories/${fileName}`;
    }

    category.nameFa = validation.data.nameFa;
    category.nameEn = validation.data.nameEn;
    category.isActive = validation.data.isActive;
    category.image = imageUrl;
    await category.save();

    if (newImage) {
      const oldFilePath = getCategoryImagePath(oldImageUrl);
      if (oldFilePath && oldImageUrl !== imageUrl) {
        await fs.unlink(oldFilePath).catch((error) => {
          if (error.code !== "ENOENT") {
            console.error("UPDATE category old image cleanup error:", error);
          }
        });
      }
    }

    return NextResponse.json({ message: "دسته بندی با موفقیت ویرایش شد", category }, { status: 200 });
  } catch (error) {
    if (uploadedFilePath) {
      await fs.unlink(uploadedFilePath).catch((cleanupError) => {
        console.error("UPDATE category image cleanup error:", cleanupError);
      });
    }
    console.error("PUT /api/categories/[id]:", error);
    return NextResponse.json({ message: "خطایی در ویرایش دسته بندی رخ داد" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "شناسه دسته بندی معتبر نیست" }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "دسته بندی پیدا نشد" }, { status: 404 });
    }

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json({
        message: "این دسته بندی به محصولات متصل است و تا حذف یا انتقال محصولات قابل حذف نیست",
      }, { status: 409 });
    }

    const oldImageUrl = category.image;
    await Category.findByIdAndDelete(id);

    const oldFilePath = getCategoryImagePath(oldImageUrl);
    if (oldFilePath) {
      await fs.unlink(oldFilePath).catch((error) => {
        if (error.code !== "ENOENT") {
          console.error("DELETE category image cleanup error:", error);
        }
      });
    }

    return NextResponse.json({ message: "دسته بندی با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/categories/[id]:", error);
    return NextResponse.json({ message: "خطایی در حذف دسته بندی رخ داد" }, { status: 500 });
  }
}
