import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";


import Category from "@/models/Category";

import { productSchema } from "@/schemas/ProductSchema";










function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(request, { params }) {
  const { id } = await params;
  console.log(params);
  console.log(id);

  try {
    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      console.error("error : ", error);
      return NextResponse.json(
        { message: "product was not found " },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: product._id.toString(),
      name: product.name,
    });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { message: "failed to fetch product " },
      { status: 500 },
    );
  }
}
// app/api/products/[id]/route.js

// import { NextResponse } from "next/server";
// import { unlink } from "fs/promises";
// import path from "path";

// import mongoose from "mongoose";

// import { connectDB } from "@/lib/mongodb";
// import Product from "@/models/Product";


export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    
    

    // بررسی ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "شناسه محصول معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // محصول را پیدا کن
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          message: "محصول پیدا نشد.",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // حذف فایل‌های تصاویر
    // -----------------------------------------

    for (const image of product.images) {
      if (!image?.url) continue;

      const filePath = path.join(
        process.cwd(),
        "public",
        image.url
      );

      try {
        await unlink(filePath);

        console.log(
          "Image deleted:",
          filePath
        );

      } catch (error) {

        // اگر فایل قبلاً حذف شده باشد،
        // حذف محصول را متوقف نکن

        if (error.code !== "ENOENT") {
          console.error(
            "Error deleting image:",
            image.url,
            error
          );
        }
      }
    }

    // -----------------------------------------
    // حذف محصول از MongoDB
    // -----------------------------------------

    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message:
          "محصول و تصاویر آن با موفقیت حذف شدند.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "DELETE /api/products/[id]:",
      error
    );

    return NextResponse.json(
      {
        message:
          "خطایی هنگام حذف محصول رخ داد.",
      },
      { status: 500 }
    );
  }
}


const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


export async function PUT(req, { params }) {

  try {

    await connectDB();

    const { id } = await params;
    console.log(id);
    console.log(params);


    // ==========================================
    // بررسی ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "شناسه محصول معتبر نیست.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // محصول
    // ==========================================

    const product =
      await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          message: "محصول پیدا نشد.",
        },
        { status: 404 }
      );
    }


    // ==========================================
    // FormData
    // ==========================================

    const formData =
      await req.formData();


    const name =
      formData.get("name");

    const slug =
      formData.get("slug");

    const description =
      formData.get("description");

    const price =
      formData.get("price");

    const stock =
      formData.get("stock");

    const category =
      formData.get("category");


    // ==========================================
    // Manifest
    // ==========================================

    let imageManifest;

    try {

      imageManifest =
        JSON.parse(
          formData.get(
            "imageManifest"
          ) || "[]"
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
    // فایل‌های جدید
    // ==========================================

    const newFiles =
      formData
        .getAll("images")
        .filter(
          (item) =>
            item instanceof File
        );


    // ==========================================
    // Zod
    // ==========================================

    const validation =
      productSchema.safeParse({
        name,
        slug,
        description:
          description || "",
        price,
        stock,
        category,
      });


    if (!validation.success) {
       console.log("validation error : " , validation.error.flatten());
       
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


    const data =
      validation.data;


    // ==========================================
    // Category
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
    // Slug
    // ==========================================

    const duplicateSlug =
      await Product.findOne({
        slug: data.slug,

        _id: {
          $ne: id,
        },
      });


    if (duplicateSlug) {

      return NextResponse.json(
        {
          message:
            "محصول دیگری با این slug وجود دارد.",
        },
        { status: 409 }
      );
    }


    // ==========================================
    // بررسی فایل‌های جدید
    // ==========================================

    for (const file of newFiles) {

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
    // بررسی Manifest
    // ==========================================

    const oldImages =
      product.images.map(
        (image) => ({
          url: image.url,
          isPrimary:
            image.isPrimary,
        })
      );


    const oldUrls =
      oldImages.map(
        (image) => image.url
      );


    // ==========================================
    // ساخت تصاویر نهایی
    // ==========================================

    const finalImages = [];

    const newlyUploadedFiles = [];

    for (
      const item of imageManifest
    ) {

      // ----------------------------------------
      // Existing
      // ----------------------------------------

      if (
        item.type ===
        "existing"
      ) {

        if (
          !item.url ||
          !oldUrls.includes(
            item.url
          )
        ) {

          return NextResponse.json(
            {
              message:
                "یکی از تصاویر قبلی معتبر نیست.",
            },
            { status: 400 }
          );
        }


        finalImages.push({
          url: item.url,

          isPrimary:
            Boolean(
              item.isPrimary
            ),
        });


        continue;
      }


      // ----------------------------------------
      // New
      // ----------------------------------------

      if (
        item.type === "new"
      ) {

        if (
          typeof item.fileIndex !==
          "number"
        ) {

          return NextResponse.json(
            {
              message:
                "اطلاعات تصویر جدید معتبر نیست.",
            },
            { status: 400 }
          );
        }


        const file =
          newFiles[
            item.fileIndex
          ];


        if (!file) {

          return NextResponse.json(
            {
              message:
                "فایل تصویر پیدا نشد.",
            },
            { status: 400 }
          );
        }


        newlyUploadedFiles.push({
          file,

          isPrimary:
            Boolean(
              item.isPrimary
            ),
        });

      }
    }


    // ==========================================
    // Upload تصاویر جدید
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


    for (
      const uploaded
      of newlyUploadedFiles
    ) {

      const extension =
        uploaded.file.type ===
        "image/jpeg"
          ? ".jpg"
          : uploaded.file.type ===
            "image/png"
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
        await uploaded.file.arrayBuffer();


      await writeFile(
        filePath,
        Buffer.from(bytes)
      );


      finalImages.push({
        url:
          `/uploads/products/${fileName}`,

        isPrimary:
          uploaded.isPrimary,
      });
    }


    // ==========================================
    // حداقل یک تصویر
    // ==========================================

    if (
      finalImages.length === 0
    ) {

      return NextResponse.json(
        {
          message:
            "محصول باید حداقل یک تصویر داشته باشد.",
        },
        { status: 400 }
      );
    }


    // ==========================================
    // دقیقاً یک Primary
    // ==========================================

    const primaryCount =
      finalImages.filter(
        (image) =>
          image.isPrimary
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
    // پیدا کردن تصاویر حذف‌شده
    // ==========================================

    const finalUrls =
      finalImages.map(
        (image) => image.url
      );


    const deletedImages =
      oldUrls.filter(
        (oldUrl) =>
          !finalUrls.includes(
            oldUrl
          )
      );


    // ==========================================
    // Update MongoDB
    // ==========================================

    product.name =
      data.name;

    product.slug =
      data.slug;

    product.description =
      data.description;

    product.price =
      data.price;

    product.stock =
      data.stock;

    product.category =
      data.category;

    product.images =
      finalImages;


    await product.save();


    // ==========================================
    // حذف فایل‌های قدیمی
    // ==========================================

    for (
      const imageUrl
      of deletedImages
    ) {

      const filePath =
        path.join(
          process.cwd(),
          "public",
          imageUrl
        );


      try {

        await unlink(
          filePath
        );

      } catch (error) {

        console.error(
          "خطا در حذف تصویر:",
          imageUrl,
          error
        );

      }
    }


    // ==========================================
    // Response
    // ==========================================

    return NextResponse.json(
      {
        message:
          "محصول با موفقیت ویرایش شد.",

        product,
      },
      { status: 200 }
    );


  } catch (error) {

    console.error(
      "PUT /api/products/[id]:",
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

