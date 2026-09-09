import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { brandCreateSchema } from "@/schemas/brandSchema";
import { authOptions } from "@/lib/auth";
import {
  validateImageFile,
  uploadImageToCloudinary,
  deleteImagesFromCloudinary,
} from "@/lib/cloudinary";

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

    const nameFa = formData.get("nameFa");
    const nameEn = formData.get("nameEn");
    const slug = formData.get("slug");
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "تصویر برند الزامی است" },
        { status: 400 },
      );
    }

    const validation = brandCreateSchema.safeParse({
      nameFa,
      nameEn,
      slug,
      image,
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

    const fileCheck = validateImageFile(image);
    if (!fileCheck.valid) {
      return NextResponse.json({ message: fileCheck.message }, { status: 400 });
    }

    const existingBrand = await Brand.findOne({ slug });
    if (existingBrand) {
      return NextResponse.json(
        { message: "این برند وجود دارد" },
        { status: 409 },
      );
    }

    const result = await uploadImageToCloudinary(image, "brands");
    uploadedPublicId = result.public_id;

    const brand = await Brand.create({
      nameFa,
      nameEn,
      slug,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    return NextResponse.json(
      { message: "برند با موفقیت ایجاد شد", brand },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedPublicId) {
      await deleteImagesFromCloudinary([uploadedPublicId]).catch((e) =>
        console.error("CREATE brand image cleanup error:", e),
      );
    }

    console.error("CREATE brand ERROR:", error);

    return NextResponse.json(
      { message: "خطایی در ایجاد برند رخ داد" },
      { status: 500 },
    );
  }
}
