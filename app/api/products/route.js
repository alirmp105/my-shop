import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { productSchema } from "@/schemas/ProductSchema";
import Category from "@/models/Category";
// app/api/products/route.js
import mongoose from "mongoose";


export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().populate("category");

    return NextResponse.json(
      products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        slug : product.slug,
        price: product.price,
        stock: product.stock,
        image: product.image,
        category: product.category.name,
      })),
    );
  } catch (error) {
    console.error("error msg :", error);
    return NextResponse.json(
      { message: "failed to fetch products" },
      { status: 500 },
    );
  }
}



// app/api/products/route.js


// app/api/products/route.js


import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";





// ==================================================
// تنظیمات آپلود
// ==================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


// ==================================================
// POST
// ==================================================




export async function POST(req) {
  try {

    await connectDB();


    // ==========================================
    // FormData
    // ==========================================

    const formData = await req.formData();

    console.log(
  "IMAGE MANIFEST:",
  formData.get("imageManifest")
);

console.log(
  "FILES:",
  formData.getAll("images")
);


    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const category = formData.get("category");


    // ==========================================
    // دریافت Manifest تصاویر
    // ==========================================

    let imageManifest;

    try {

      imageManifest = JSON.parse(
        formData.get("imageManifest") || "[]"
      );

    } catch {

      return NextResponse.json(
        {
          message:
            "اطلاعات تصاویر معتبر نیست.",
        },
        { status: 400 }
      );
    }


    if (!Array.isArray(imageManifest)) {

      return NextResponse.json(
        {
          message:
            "ساختار تصاویر معتبر نیست.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // دریافت فایل‌ها
    // ==========================================

    const files = formData
      .getAll("images")
      .filter(
        (item) => item instanceof File
      );


    // ==========================================
    // Zod
    // ==========================================

    const validation =
      productSchema.safeParse({
        name,
        slug,
        description: description || "",
        price,
        stock,
        category,
      });


    if (!validation.success) {

      return NextResponse.json(
        {
          message:
            "اطلاعات محصول معتبر نیست.",

          errors:
            validation.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }


    const data = validation.data;


    // ==========================================
    // بررسی Category
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        data.category
      )
    ) {

      return NextResponse.json(
        {
          message:
            "شناسه دسته‌بندی معتبر نیست.",
        },
        { status: 400 }
      );
    }


    const categoryExists =
      await Category.findById(
        data.category
      );


    if (!categoryExists) {

      return NextResponse.json(
        {
          message:
            "دسته‌بندی پیدا نشد.",
        },
        { status: 404 }
      );
    }


    // ==========================================
    // بررسی Slug
    // ==========================================

    const existingProduct =
      await Product.findOne({
        slug: data.slug,
      });


    if (existingProduct) {

      return NextResponse.json(
        {
          message:
            "محصولی با این slug وجود دارد.",
        },
        { status: 409 }
      );
    }


    // ==========================================
    // بررسی تعداد تصاویر
    // ==========================================

    if (
      imageManifest.length === 0
    ) {

      return NextResponse.json(
        {
          message:
            "حداقل یک تصویر برای محصول انتخاب کنید.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // همه تصاویر Create باید NEW باشند
    // ==========================================

    const invalidManifest =
      imageManifest.some(
        (item) =>
          item.type !== "new"
      );


    if (invalidManifest) {

      return NextResponse.json(
        {
          message:
            "اطلاعات تصاویر جدید معتبر نیست.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // بررسی fileIndex
    // ==========================================

    const usedIndexes = new Set();


    for (
      const item of imageManifest
    ) {

      if (
        typeof item.fileIndex !==
        "number"
      ) {

        return NextResponse.json(
          {
            message:
              "شناسه فایل تصویر معتبر نیست.",
          },
          { status: 400 }
        );
      }


      if (
        item.fileIndex < 0 ||
        item.fileIndex >= files.length
      ) {

        return NextResponse.json(
          {
            message:
              "یکی از فایل‌های تصویر پیدا نشد.",
          },
          { status: 400 }
        );
      }


      // جلوگیری از استفاده دوباره
      // از یک فایل

      if (
        usedIndexes.has(
          item.fileIndex
        )
      ) {

        return NextResponse.json(
          {
            message:
              "یک فایل تصویر چند بار استفاده شده است.",
          },
          { status: 400 }
        );
      }


      usedIndexes.add(
        item.fileIndex
      );
    }


    // تعداد Manifest و فایل‌ها باید برابر باشد

    if (
      usedIndexes.size !==
      files.length
    ) {

      return NextResponse.json(
        {
          message:
            "تعداد تصاویر ارسال‌شده معتبر نیست.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // بررسی فایل‌ها
    // ==========================================

    for (const file of files) {

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        return NextResponse.json(
          {
            message:
              "فرمت یکی از تصاویر مجاز نیست.",
          },
          { status: 400 }
        );
      }


      if (
        file.size >
        MAX_FILE_SIZE
      ) {

        return NextResponse.json(
          {
            message:
              "حجم هر تصویر نباید بیشتر از 5MB باشد.",
          },
          { status: 400 }
        );
      }
    }


    // ==========================================
    // دقیقاً یک Primary
    // ==========================================

    const primaryCount =
      imageManifest.filter(
        (item) =>
          item.isPrimary === true
      ).length;


    if (
      primaryCount !== 1
    ) {

      return NextResponse.json(
        {
          message:
            "محصول باید دقیقاً یک تصویر اصلی داشته باشد.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // مسیر Upload
    // ==========================================

    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "products"
      );


    await mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );


    // ==========================================
    // ذخیره تصاویر
    // ==========================================

    const savedImages = [];


    for (
      const item of imageManifest
    ) {

      const file =
        files[item.fileIndex];


      const extension =
        file.type === "image/jpeg"
          ? ".jpg"
          : file.type === "image/png"
          ? ".png"
          : ".webp";


      const fileName =
        `${crypto.randomUUID()}${extension}`;


      const filePath =
        path.join(
          uploadDirectory,
          fileName
        );


      const bytes =
        await file.arrayBuffer();


      await writeFile(
        filePath,
        Buffer.from(bytes)
      );


      savedImages.push({
        url:
          `/uploads/products/${fileName}`,

        isPrimary:
          item.isPrimary === true,
      });
    }


    // ==========================================
    // ایجاد Product
    // ==========================================

    const product =
      await Product.create({
        name: data.name,

        slug: data.slug,

        description:
          data.description,

        price: data.price,

        stock: data.stock,

        category:
          data.category,

        images:
          savedImages,
      });


    // ==========================================
    // Response
    // ==========================================

    return NextResponse.json(
      {
        message:
          "محصول با موفقیت ایجاد شد.",

        product,
      },
      { status: 201 }
    );


  } catch (error) {

    console.error(
      "POST /api/products:",
      error
    );


    return NextResponse.json(
      {
        message:
          error.message ||
          "خطای داخلی سرور.",
      },
      { status: 500 }
    );
  }
}

