import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categoryUpdateSchema } from "@/schemas/categorySchema";
import { authOptions } from "@/lib/auth";
import {
  validateImageFile,
  uploadImageToCloudinary,
  deleteImagesFromCloudinary,
} from "@/lib/cloudinary";

function parseBoolean(value) {
  return value === true || value === "true";
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "شناسه دسته بندی معتبر نیست" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json(
        { message: "دسته بندی پیدا نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      _id: category._id.toString(),
      nameFa: category.nameFa || category.name || "",
      nameEn: category.nameEn || "",
      slug: category.slug,
      image: category.image,
      imagePublicId: category.imagePublicId,
      isActive: category.isActive ?? true,
    });
  } catch (error) {
    console.error("GET /api/categories/[id]:", error);
    return NextResponse.json(
      { message: "خطا در دریافت دسته بندی" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  let uploadedPublicId = null;

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
      return NextResponse.json(
        { message: "شناسه دسته بندی معتبر نیست" },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "دسته بندی پیدا نشد" },
        { status: 404 }
      );
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
      return NextResponse.json(
        {
          message: "اطلاعات وارد شده صحیح نیست",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    let imageUrl = category.image;
    let newPublicId = null;

    if (newImage) {
      // اعتبارسنجی فایل جدید
      const fileCheck = validateImageFile(newImage);
      if (!fileCheck.valid) {
        return NextResponse.json(
          { message: fileCheck.message },
          { status: 400 },
        );
      }

      // آپلود تصویر جدید
      const result = await uploadImageToCloudinary(newImage, "categories");
      uploadedPublicId = result.public_id;
      newPublicId = result.public_id;
      imageUrl = result.secure_url;
    }

    const oldPublicId = category.imagePublicId;

    // به‌روزرسانی سند
    category.nameFa = validation.data.nameFa;
    category.nameEn = validation.data.nameEn;
    category.isActive = validation.data.isActive;
    category.image = imageUrl;
    if (newPublicId) {
      category.imagePublicId = newPublicId;
    }
    await category.save();

    // حذف تصویر قدیمی فقط پس از موفقیت دیتابیس
    if (newImage && oldPublicId && oldPublicId !== newPublicId) {
      await deleteImagesFromCloudinary([oldPublicId]).catch((error) => {
        console.error("UPDATE category old image cleanup error:", error);
      });
    }

    return NextResponse.json(
      { message: "دسته بندی با موفقیت ویرایش شد", category },
      { status: 200 }
    );
  } catch (error) {
    // Rollback: حذف تصویر جدید در صورت خطا
    if (uploadedPublicId) {
      await deleteImagesFromCloudinary([uploadedPublicId]).catch((cleanupError) => {
        console.error("UPDATE category image cleanup error:", cleanupError);
      });
    }
    console.error("PUT /api/categories/[id]:", error);
    return NextResponse.json(
      { message: "خطایی در ویرایش دسته بندی رخ داد" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { message: "شناسه دسته بندی معتبر نیست" },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "دسته بندی پیدا نشد" },
        { status: 404 }
      );
    }

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        {
          message:
            "این دسته بندی به محصولات متصل است و تا حذف یا انتقال محصولات قابل حذف نیست",
        },
        { status: 409 }
      );
    }

    const { imagePublicId } = category;

    await Category.findByIdAndDelete(id);

    // حذف تصویر از Cloudinary پس از حذف موفق سند
    if (imagePublicId) {
      await deleteImagesFromCloudinary([imagePublicId]).catch((error) => {
        console.error("DELETE category image cleanup error:", error);
      });
    }

    return NextResponse.json(
      { message: "دسته بندی با موفقیت حذف شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/categories/[id]:", error);
    return NextResponse.json(
      { message: "خطایی در حذف دسته بندی رخ داد" },
      { status: 500 }
    );
  }
}
