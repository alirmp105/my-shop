import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { brandUpdateSchema } from "@/schemas/brandSchema";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import Brand from "@/models/Brand";
import { authOptions } from "@/lib/auth";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function extensionForType(type) {
  return type === "image/jpeg"
    ? ".jpg"
    : type === "image/png"
      ? ".png"
      : ".webp";
}

export async function PUT(request, { params }) {
  let newFilePath = null;

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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه برند معتبر نیست" },
        { status: 400 },
      );
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { message: "برند پیدا نشد" },
        { status: 404 },
      );
    }

    const formData = await request.formData();

    const nameFa = formData.get("nameFa");
    const nameEn = formData.get("nameEn");
    const slug = formData.get("slug");
    const image = formData.get("image");

    const newImage =
      image instanceof File && image.size > 0
        ? image
        : undefined;

    const validation = brandUpdateSchema.safeParse({
      nameFa,
      nameEn,
      slug,
      image: newImage,
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

    const existingBrand = await Brand.findOne({
      _id: { $ne: id },
      $or: [
        { nameEn: nameEn.trim() },
        { slug: slug.trim() },
      ],
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          message: "برند با این نام یا slug قبلاً ایجاد شده است",
        },
        { status: 409 },
      );
    }

    let imageUrl = brand.image;

    // اگر تصویر جدید وجود داشت
    if (newImage) {
      if (!allowedTypes.includes(newImage.type)) {
        return NextResponse.json(
          {
            message: "فرمت تصویر مجاز نیست",
          },
          { status: 400 },
        );
      }

      if (newImage.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            message: "حجم تصویر نباید بیشتر از 5 مگابایت باشد",
          },
          { status: 400 },
        );
      }

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "brands",
      );

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      const extension = extensionForType(newImage.type);
      const fileName = `${crypto.randomUUID()}${extension}`;

      newFilePath = path.join(uploadDir, fileName);

      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(newFilePath, buffer);

      imageUrl = `/uploads/brands/${fileName}`;
    }

    const oldImageUrl = brand.image;

    brand.nameFa = nameFa.trim();
    brand.nameEn = nameEn.trim();
    brand.slug = slug.trim();
    brand.image = imageUrl;

    await brand.save();

    // اگر تصویر جدید با موفقیت در DB ثبت شد،
    // تصویر قبلی را حذف کن
    if (newImage && oldImageUrl) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        oldImageUrl,
      );

      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.error(
          "old brand image delete error:",
          error,
        );
      }
    }

    return NextResponse.json(
      {
        message: "برند با موفقیت ویرایش شد",
        brand,
      },
      { status: 200 },
    );
  } catch (error) {
    // اگر فایل جدید ذخیره شده ولی DB update شکست خورد،
    // فایل جدید را حذف کن
    if (newFilePath) {
      await fs.unlink(newFilePath).catch((cleanupError) => {
        console.error(
          "UPDATE brand image cleanup error:",
          cleanupError,
        );
      });
    }

    console.error("UPDATE brand ERROR:", error);

    return NextResponse.json(
      {
        message: "خطایی در ویرایش برند رخ داد",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه برند معتبر نیست" },
        { status: 400 },
      );
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { message: "برند پیدا نشد" },
        { status: 404 },
      );
    }

    const imageUrl = brand.image;

    await Brand.findByIdAndDelete(id);

    if (imageUrl) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        imageUrl,
      );

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(
          "delete brand image error:",
          error,
        );
      }
    }

    return NextResponse.json(
      { message: "برند با موفقیت حذف شد" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE brand ERROR:", error);

    return NextResponse.json(
      { message: "خطایی در حذف برند رخ داد" },
      { status: 500 },
    );
  }
}