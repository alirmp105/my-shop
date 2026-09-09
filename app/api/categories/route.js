import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryCreateSchema } from "@/schemas/categorySchema";
import { authOptions } from "@/lib/auth";
import {
  validateImageFile,
  uploadImageToCloudinary,
  deleteImagesFromCloudinary,
} from "@/lib/cloudinary";

function parseBoolean(value) {
  return value === true || value === "true";
}

function createSlug(value) {
  return value.trim().replace(/\s+/g, "-");
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      categories.map((category) => ({
        _id: category._id.toString(),
        nameFa: category.nameFa || category.name || "",
        nameEn: category.nameEn || "",
        slug: category.slug,
        image: category.image,
        imagePublicId: category.imagePublicId,
        isActive: category.isActive ?? true,
      })),
    );
  } catch (error) {
    console.error("GET /api/categories:", error);
    return NextResponse.json(
      { message: "خطا در دریافت دسته بندی ها" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
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
    const formData = await request.formData();
    const image = formData.get("image");

    const validation = categoryCreateSchema.safeParse({
      nameFa: formData.get("nameFa"),
      nameEn: formData.get("nameEn"),
      image,
      isActive: parseBoolean(formData.get("isActive")),
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

    // اعتبارسنجی فایل تصویر
    const fileCheck = validateImageFile(image);
    if (!fileCheck.valid) {
      return NextResponse.json(
        { message: fileCheck.message },
        { status: 400 },
      );
    }

    const slug = createSlug(validation.data.nameEn);
    if (await Category.exists({ slug })) {
      return NextResponse.json(
        { message: "دسته بندی با این slug قبلاً ایجاد شده است" },
        { status: 409 },
      );
    }

    // آپلود به Cloudinary
    const result = await uploadImageToCloudinary(image, "categories");
    uploadedPublicId = result.public_id;

    // ذخیره در دیتابیس
    const category = await Category.create({
      nameFa: validation.data.nameFa,
      nameEn: validation.data.nameEn,
      slug,
      image: result.secure_url,
      imagePublicId: result.public_id,
      isActive: validation.data.isActive,
    });

    return NextResponse.json(
      { message: "دسته بندی با موفقیت ایجاد شد", category },
      { status: 201 },
    );
  } catch (error) {
    // Rollback: حذف تصویر آپلودشده در صورت خطا
    if (uploadedPublicId) {
      await deleteImagesFromCloudinary([uploadedPublicId]).catch(
        (cleanupError) => {
          console.error("CREATE category image cleanup error:", cleanupError);
        },
      );
    }
    console.error("POST /api/categories:", error);
    return NextResponse.json(
      { message: "خطایی در ایجاد دسته بندی رخ داد" },
      { status: 500 },
    );
  }
}
