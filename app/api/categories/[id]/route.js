import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { categoryUpdateSchema } from "@/schemas/categorySchema";
import fs from "fs/promises";
import path from "path";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(request, { params }) {
  const { id } = await params;
  console.log(params);
  console.log(id);

  try {
    await connectDB();

    const category = await Category.findById(id).lean();

    if (!category) {
      console.error("error : ", error);
      return NextResponse.json(
        { message: "category was not found " },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
    });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { message: "failed to fetch category " },
      { status: 500 },
    );
  }
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const maxFileSize = 5 * 1024 * 1024;

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // بررسی معتبر بودن ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه دسته بندی معتبر نیست" },
        { status: 400 },
      );
    }

    // پیدا کردن Category
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: "دسته بندی پیدا نشد" },
        { status: 404 },
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const image = formData.get("image");

    // تبدیل مقدار image به undefined
    // اگر فایل جدیدی ارسال نشده باشد
    const newImage =
      image instanceof File && image.size > 0 ? image : undefined;

    // Validation
    const validation = categoryUpdateSchema.safeParse({
      name,
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

    // بررسی duplicate بودن name یا slug
    const existingCategory = await Category.findOne({
      _id: { $ne: id },

      $or: [{ name: name.trim() }, { slug: slug.trim() }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          message: "دسته بندی با این نام یا slug قبلاً ایجاد شده است",
        },
        { status: 409 },
      );
    }

    let imageUrl = category.image;
    let newFilePath = null;

    // اگر عکس جدید وجود داشت
    if (newImage) {
      // بررسی نوع فایل
      if (!allowedTypes.includes(newImage.type)) {
        return NextResponse.json(
          {
            message: "فرمت تصویر مجاز نیست",
          },
          { status: 400 },
        );
      }

      // بررسی حجم
      if (newImage.size > maxFileSize) {
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
        "categories",
      );

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      const extension = path.extname(newImage.name);

      const fileName = `${crypto.randomUUID()}${extension}`;

      newFilePath = path.join(uploadDir, fileName);

      const bytes = await newImage.arrayBuffer();

      const buffer = Buffer.from(bytes);

      await fs.writeFile(newFilePath, buffer);

      imageUrl = `/uploads/categories/${fileName}`;
    }

    // آپدیت MongoDB
    category.name = name.trim();
    category.slug = slug.trim();
    category.image = imageUrl;

    await category.save();

    const oldImageUrl = category.image;
    // اگر عکس جدید ذخیره شد،
    // عکس قبلی را حذف کن
    if (newImage && oldImageUrl) {
      const oldFilePath = path.join(process.cwd(), "public", oldImageUrl);

      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.error("old category image delete error : ", error);
      }

      // این قسمت باید قبل از تغییر category.image ذخیره شده باشد
    }

    return NextResponse.json(
      {
        message: "دسته بندی با موفقیت ویرایش شد",
        category,
      },
      { status: 200 },
    );
  } catch (error) {
    if (newFilePath) {
      try {
        await fs.unlink(newFilePath);
      } catch (deleteError) {
        console.error(deleteError);
        
      }
    }
    console.error("UPDATE CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        message: "خطایی در ویرایش دسته بندی رخ داد",
      },
      { status: 500 },
    );
  }
}


export async function DELETE(request,{params}) {
 try {
   await connectDB()

  const {id} = await params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه دسته بندی معتبر نیست" },
        { status: 400 },
      );
    }

    // پیدا کردن Category
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: "دسته بندی پیدا نشد" },
        { status: 404 },
      );
    }
  
    const imageUrl = category.image;
    await Category.findByIdAndDelete(id)

    //حذف فایل تصویر

    if (imageUrl) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        imageUrl
      )
    }

    try {
      await fs.unlink(imagePath)
    } catch (error) {
     console.error("delete category image error " , error);
    }

    return NextResponse.json(
      {message : "دسته بندی  با موفقیت حذف شد"} , {status : 200}
    )
 } catch (error) {
  
  return NextResponse.json(
    {message : "خطایی در حذف دسته بندی رخ داد"} , {status : 500}
  )
 }
  
}