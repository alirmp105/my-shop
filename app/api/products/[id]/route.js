import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import { productSchema } from "@/schemas/ProductSchema";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 10;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

// تابع کمکی آپلود فایل به Cloudinary همراه با اعتبارسنجی بایت‌های جادویی (Magic Bytes)
async function uploadToCloudinary(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isJPEG = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e;
  const isWebP =
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  if (!isJPEG && !isPNG && !isWebP) {
    throw new Error("محتوای فایل نامعتبر است یا با پسوند آن همخوانی ندارد.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

// --------------------------------------------------------------------------
// 1. دریافت تکی محصول (GET)
// --------------------------------------------------------------------------
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه محصول نامعتبر است." },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "محصول پیدا نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?.toString(),
      brand: product.brand?.toString() || null,
      specifications: product.specifications || [],
      images: product.images || [],
    });
  } catch (error) {
    console.error("GET /api/products/[id]:", error);
    return NextResponse.json(
      { message: "خطای سرور در دریافت اطلاعات محصول." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------
// 2. حذف محصول و تصاویر آن از Cloudinary (DELETE)
// --------------------------------------------------------------------------
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه محصول معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "محصول پیدا نشد." },
        { status: 404 }
      );
    }

    // استخراج تمام publicId تصاویر جهت پاکسازی از Cloudinary
    const publicIdsToDelete = (product.images || [])
      .map((img) => img.publicId)
      .filter(Boolean);

    if (publicIdsToDelete.length > 0) {
      try {
        await cloudinary.api.delete_resources(publicIdsToDelete);
      } catch (cloudErr) {
        console.error("خطا در حذف تصاویر از Cloudinary:", cloudErr);
      }
    }

    // حذف سند از دیتابیس
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "محصول و تمامی تصاویر آن با موفقیت حذف شدند." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { message: "خطایی هنگام حذف محصول رخ داد." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------
// 3. ویرایش محصول (PUT)
// --------------------------------------------------------------------------
export async function PUT(req, { params }) {
  const newUploadedPublicIds = []; // جهت Rollback در صورت رخداد خطا

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه محصول معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "محصول پیدا نشد." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const specificationsRaw = formData.get("specifications");

    // اعتبارسنجی ساختار manifest
    let imageManifest;
    try {
      imageManifest = JSON.parse(formData.get("imageManifest") || "[]");
    } catch {
      return NextResponse.json(
        { message: "اطلاعات ساختار تصاویر نامعتبر است." },
        { status: 400 }
      );
    }

    if (!Array.isArray(imageManifest)) {
      return NextResponse.json(
        { message: "فرمت ساختار تصاویر نامعتبر است." },
        { status: 400 }
      );
    }

    // اعتبارسنجی مشخصات فنی (specifications)
    let specifications = [];
    if (specificationsRaw) {
      try {
        specifications = JSON.parse(specificationsRaw);
      } catch {
        return NextResponse.json(
          { message: "فرمت مشخصات محصول نامعتبر است." },
          { status: 400 }
        );
      }

      if (!Array.isArray(specifications)) {
        return NextResponse.json(
          { message: "ساختار مشخصات محصول نامعتبر است." },
          { status: 400 }
        );
      }
    }

    // دریافت فایل‌های باینری جدید
    const newFiles = formData
      .getAll("images")
      .filter((item) => item instanceof File);

    if (imageManifest.length > MAX_IMAGES) {
      return NextResponse.json(
        { message: `حداکثر مجاز به داشتن ${MAX_IMAGES} تصویر هستید.` },
        { status: 400 }
      );
    }

    // اعتبارسنجی توسط Zod
    const validation = productSchema.safeParse({
      name,
      slug,
      description: description || "",
      price,
      stock,
      category,
      brand: brand || undefined,
      specifications,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "اطلاعات محصول معتبر نیست.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // بررسی دسته‌بندی
    if (!mongoose.Types.ObjectId.isValid(data.category)) {
      return NextResponse.json(
        { message: "شناسه دسته‌بندی معتبر نیست." },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      return NextResponse.json(
        { message: "دسته‌بندی پیدا نشد." },
        { status: 404 }
      );
    }

    // بررسی برند در صورت ارسال
    if (data.brand) {
      if (!mongoose.Types.ObjectId.isValid(data.brand)) {
        return NextResponse.json(
          { message: "شناسه برند معتبر نیست." },
          { status: 400 }
        );
      }

      const brandExists = await Brand.findById(data.brand);
      if (!brandExists) {
        return NextResponse.json(
          { message: "برند پیدا نشد." },
          { status: 404 }
        );
      }
    }

    // بررسی عدم تکراری بودن Slug به جز برای خود این محصول
    const duplicateSlug = await Product.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { message: "محصول دیگری با این slug وجود دارد." },
        { status: 409 }
      );
    }

    // اعتبارسنجی پسوند و حجم فایل‌های ارسالی جدید
    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: "فرمت یکی از فایل‌های ارسالی مجاز نیست." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "حجم هر فایل نباید از ۵ مگابایت بیشتر باشد." },
          { status: 400 }
        );
      }
    }

    // بررسی و مطابقت تصاویر قبلی
    const currentImages = product.images || [];
    const currentPublicIds = currentImages.map((img) => img.publicId).filter(Boolean);

    const finalImages = [];
    const usedNewIndexes = new Set();

    for (const item of imageManifest) {
      if (item.type === "existing") {
        // پیدا کردن تصویر بر اساس publicId یا url
        const existingImg = currentImages.find(
          (img) => (item.publicId && img.publicId === item.publicId) || img.url === item.url
        );

        if (!existingImg) {
          return NextResponse.json(
            { message: "یکی از تصاویر قبلی در سیستم یافت نشد." },
            { status: 400 }
          );
        }

        finalImages.push({
          url: existingImg.url,
          publicId: existingImg.publicId,
          isPrimary: Boolean(item.isPrimary),
        });
      } else if (item.type === "new") {
        if (
          typeof item.fileIndex !== "number" ||
          item.fileIndex < 0 ||
          item.fileIndex >= newFiles.length
        ) {
          return NextResponse.json(
            { message: "اندیس یکی از تصاویر جدید نامعتبر است." },
            { status: 400 }
          );
        }

        if (usedNewIndexes.has(item.fileIndex)) {
          return NextResponse.json(
            { message: "یک فایل چند بار در ساختار جدید ارجاع داده شده است." },
            { status: 400 }
          );
        }

        usedNewIndexes.add(item.fileIndex);

        // آپلود مستقیم به Cloudinary
        const file = newFiles[item.fileIndex];
        const uploadResult = await uploadToCloudinary(file);
        
        newUploadedPublicIds.push(uploadResult.public_id);

        finalImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          isPrimary: Boolean(item.isPrimary),
        });
      }
    }

    // حداقل ۱ تصویر الزامی است
    if (finalImages.length === 0) {
      return NextResponse.json(
        { message: "محصول باید حداقل یک تصویر داشته باشد." },
        { status: 400 }
      );
    }

    // الزام وجود دقیقاً یک تصویر شاخص (Primary)
    const primaryCount = finalImages.filter((img) => img.isPrimary).length;
    if (primaryCount !== 1) {
      return NextResponse.json(
        { message: "محصول باید دقیقاً یک تصویر اصلی (Primary) داشته باشد." },
        { status: 400 }
      );
    }

    // پیدا کردن تصاویری که حذف شده‌اند و باید از Cloudinary پاک شوند
    const finalPublicIds = finalImages.map((img) => img.publicId).filter(Boolean);
    const deletedPublicIds = currentPublicIds.filter(
      (pubId) => !finalPublicIds.includes(pubId)
    );

    // به‌روزرسانی در دیتابیس
    product.name = data.name;
    product.slug = data.slug;
    product.description = data.description;
    product.price = data.price;
    product.stock = data.stock;
    product.category = data.category;
    product.brand = data.brand || null;
    product.specifications = data.specifications || [];
    product.images = finalImages;

    await product.save();

    // پاکسازی تصاویر حذف‌شده از Cloudinary در پس‌زمینه
    if (deletedPublicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(deletedPublicIds);
      } catch (err) {
        console.error("خطا در پاکسازی تصاویر حذف‌شده از Cloudinary:", err);
      }
    }

    return NextResponse.json(
      {
        message: "محصول با موفقیت ویرایش شد.",
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    // در صورت بروز خطا در هر مرحله، فایل‌های جدیدی که روی کلود آپلود شده‌اند پاک شوند
    if (newUploadedPublicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(newUploadedPublicIds);
      } catch (cleanupError) {
        console.error("خطا در Rollback تصاویر آپلودشده:", cleanupError);
      }
    }

    console.error("PUT /api/products/[id]:", error);
    return NextResponse.json(
      { message: "خطای داخلی سرور هنگام ویرایش محصول." },
      { status: 500 }
    );
  }
}
