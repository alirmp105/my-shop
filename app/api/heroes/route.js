import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";
import { heroCreateSchema } from "@/schemas/heroSchema";
import {
  deleteImagesFromCloudinary,
  uploadImageToCloudinary,
  validateImageFile,
} from "@/lib/cloudinary";

const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== "admin") return { response: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  return { session };
};

const parseBoolean = (value) => value === true || value === "true";

const serialize = (hero) => ({
  ...hero,
  _id: hero._id.toString(),
  image: {
    url: hero.image?.url || "",
    publicId: hero.image?.publicId || "",
    type: hero.image?.type || "image",
  },
  startAt: hero.startAt ? new Date(hero.startAt).toISOString() : null,
  endAt: hero.endAt ? new Date(hero.endAt).toISOString() : null,
  createdAt: hero.createdAt ? new Date(hero.createdAt).toISOString() : null,
  updatedAt: hero.updatedAt ? new Date(hero.updatedAt).toISOString() : null,
});

export async function GET() {
  try {
    await connectDB();
    const heroes = await Hero.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(heroes.map(serialize));
  } catch (error) {
    console.error("GET /api/heroes:", error);
    return NextResponse.json({ message: "خطا در دریافت اسلایدها" }, { status: 500 });
  }
}

export async function POST(request) {
  let uploadedPublicId = null;
  try {
    const auth = await isAdmin();
    if (auth.response) return auth.response;
    await connectDB();
    const formData = await request.formData();
    const image = formData.get("image");
    const validation = heroCreateSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      buttonText: formData.get("buttonText"),
      buttonHref: formData.get("buttonHref"),
      order: formData.get("order") || 0,
      isActive: parseBoolean(formData.get("isActive")),
      startAt: formData.get("startAt"),
      endAt: formData.get("endAt"),
      image,
    });
    if (!validation.success) return NextResponse.json({ message: "اطلاعات وارد شده صحیح نیست", errors: validation.error.flatten().fieldErrors }, { status: 400 });

    const fileCheck = validateImageFile(image);
    if (!fileCheck.valid) return NextResponse.json({ message: fileCheck.message }, { status: 400 });
    const result = await uploadImageToCloudinary(image, "heroes");
    uploadedPublicId = result.public_id;
    const hero = await Hero.create({
      title: validation.data.title,
      subtitle: validation.data.subtitle,
      image: { url: result.secure_url, publicId: result.public_id, type: image.type || "image" },
      button: { text: validation.data.buttonText, href: validation.data.buttonHref },
      order: validation.data.order,
      isActive: validation.data.isActive,
      startAt: validation.data.startAt || null,
      endAt: validation.data.endAt || null,
    });
    return NextResponse.json({ message: "اسلاید با موفقیت ایجاد شد", hero: serialize(hero.toObject()) }, { status: 201 });
  } catch (error) {
    if (uploadedPublicId) await deleteImagesFromCloudinary([uploadedPublicId]).catch(() => {});
    console.error("POST /api/heroes:", error);
    return NextResponse.json({ message: "خطایی در ایجاد اسلاید رخ داد" }, { status: 500 });
  }
}
