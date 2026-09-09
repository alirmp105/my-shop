import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { brandUpdateSchema } from "@/schemas/brandSchema";
import { authOptions } from "@/lib/auth";
import {
  validateImageFile,
  uploadImageToCloudinary,
  deleteImagesFromCloudinary,
} from "@/lib/cloudinary";

export async function PUT(request, { params }) {
  let newPublicId = null;

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
        { message: "شناسه برند معتبر نیست" },
        { status: 400 },
      );
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json({ message: "برند پیدا نشد" }, { status: 404 });
    }

    const formData = await request.formData();

    const nameFa = formData.get("nameFa");
    const nameEn = formData.get("nameEn");
    const slug = formData.get("slug");
    const image = formData.get("image");

    const newImage =
      image instanceof File && image.size > 0 ? image : undefined;

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
      $or: [{ nameEn: nameEn.trim() }, { slug: slug.trim() }],
    });

    if (existingBrand) {
      return NextResponse.json(
        { message: "برند با این نام یا slug قبلاً ایجاد شده است" },
        { status: 409 },
      );
    }

    let imageUrl = brand.image;
    let imagePublicId = brand.imagePublicId;
    const oldPublicId = brand.imagePublicId;

    if (newImage) {
      const fileCheck = validateImageFile(newImage);
      if (!fileCheck.valid) {
        return NextResponse.json(
          { message: fileCheck.message },
          { status: 400 },
        );
      }

      const result = await uploadImageToCloudinary(newImage, "brands");
      newPublicId = result.public_id;
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    brand.nameFa = nameFa.trim();
    brand.nameEn = nameEn.trim();
    brand.slug = slug.trim();
    brand.image = imageUrl;
    brand.imagePublicId = imagePublicId;

    await brand.save();

    // تصویر قبلی را بعد از ثبت موفق در DB حذف کن
    if (newImage && oldPublicId) {
      await deleteImagesFromCloudinary([oldPublicId]).catch((e) =>
        console.error("UPDATE brand old image cleanup error:", e),
      );
    }

    return NextResponse.json(
      { message: "برند با موفقیت ویرایش شد", brand },
      { status: 200 },
    );
  } catch (error) {
    // اگر آپلود موفق بود ولی DB ذخیره نشد، تصویر جدید را rollback کن
    if (newPublicId) {
      await deleteImagesFromCloudinary([newPublicId]).catch((e) =>
        console.error("UPDATE brand new image cleanup error:", e),
      );
    }

    console.error("UPDATE brand ERROR:", error);

    return NextResponse.json(
      { message: "خطایی در ویرایش برند رخ داد" },
      { status: 500 },
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
        { message: "شناسه برند معتبر نیست" },
        { status: 400 },
      );
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json({ message: "برند پیدا نشد" }, { status: 404 });
    }

    const { imagePublicId } = brand;

    await Brand.findByIdAndDelete(id);

    if (imagePublicId) {
      await deleteImagesFromCloudinary([imagePublicId]).catch((e) =>
        console.error("DELETE brand image cleanup error:", e),
      );
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
