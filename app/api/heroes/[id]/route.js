import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";
import { heroUpdateSchema } from "@/schemas/heroSchema";
import { deleteImagesFromCloudinary, uploadImageToCloudinary, validateImageFile } from "@/lib/cloudinary";

const parseBoolean = (value) => value === true || value === "true";
const serialize = (hero) => ({
  ...hero,
  _id: hero._id.toString(),
  image: { url: hero.image?.url || "", publicId: hero.image?.publicId || "", type: hero.image?.type || "image" },
  startAt: hero.startAt ? new Date(hero.startAt).toISOString() : null,
  endAt: hero.endAt ? new Date(hero.endAt).toISOString() : null,
  createdAt: hero.createdAt ? new Date(hero.createdAt).toISOString() : null,
  updatedAt: hero.updatedAt ? new Date(hero.updatedAt).toISOString() : null,
});

async function authorize() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  return null;
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "شناسه اسلاید معتبر نیست" }, { status: 400 });
  try {
    await connectDB();
    const hero = await Hero.findById(id).lean();
    if (!hero) return NextResponse.json({ message: "اسلاید پیدا نشد" }, { status: 404 });
    return NextResponse.json(serialize(hero));
  } catch (error) {
    console.error("GET /api/heroes/[id]:", error);
    return NextResponse.json({ message: "خطا در دریافت اسلاید" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  let uploadedPublicId = null;
  const denied = await authorize();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "شناسه اسلاید معتبر نیست" }, { status: 400 });
  try {
    await connectDB();
    const hero = await Hero.findById(id);
    if (!hero) return NextResponse.json({ message: "اسلاید پیدا نشد" }, { status: 404 });
    const formData = await request.formData();
    const image = formData.get("image");
    const newImage = image instanceof File && image.size > 0 ? image : undefined;
    const validation = heroUpdateSchema.safeParse({
      title: formData.get("title"), subtitle: formData.get("subtitle"),
      buttonText: formData.get("buttonText"), buttonHref: formData.get("buttonHref"),
      order: formData.get("order") || 0, isActive: parseBoolean(formData.get("isActive")),
      startAt: formData.get("startAt"), endAt: formData.get("endAt"), image: newImage,
    });
    if (!validation.success) return NextResponse.json({ message: "اطلاعات وارد شده صحیح نیست", errors: validation.error.flatten().fieldErrors }, { status: 400 });

    const oldPublicId = hero.image?.publicId;
    let imageData = hero.image;
    if (newImage) {
      const fileCheck = validateImageFile(newImage);
      if (!fileCheck.valid) return NextResponse.json({ message: fileCheck.message }, { status: 400 });
      const result = await uploadImageToCloudinary(newImage, "heroes");
      uploadedPublicId = result.public_id;
      imageData = { url: result.secure_url, publicId: result.public_id, type: newImage.type || "image" };
    }
    hero.title = validation.data.title;
    hero.subtitle = validation.data.subtitle;
    hero.button = { text: validation.data.buttonText, href: validation.data.buttonHref };
    hero.order = validation.data.order;
    hero.isActive = validation.data.isActive;
    hero.startAt = validation.data.startAt || null;
    hero.endAt = validation.data.endAt || null;
    hero.image = imageData;
    await hero.save();
    if (newImage && oldPublicId) await deleteImagesFromCloudinary([oldPublicId]).catch(() => {});
    return NextResponse.json({ message: "اسلاید با موفقیت ویرایش شد", hero: serialize(hero.toObject()) });
  } catch (error) {
    if (uploadedPublicId) await deleteImagesFromCloudinary([uploadedPublicId]).catch(() => {});
    console.error("PUT /api/heroes/[id]:", error);
    return NextResponse.json({ message: "خطایی در ویرایش اسلاید رخ داد" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await authorize();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "شناسه اسلاید معتبر نیست" }, { status: 400 });
  try {
    await connectDB();
    const hero = await Hero.findById(id);
    if (!hero) return NextResponse.json({ message: "اسلاید پیدا نشد" }, { status: 404 });
    await Hero.findByIdAndDelete(id);
    if (hero.image?.publicId) await deleteImagesFromCloudinary([hero.image.publicId]).catch(() => {});
    return NextResponse.json({ message: "اسلاید با موفقیت حذف شد" });
  } catch (error) {
    console.error("DELETE /api/heroes/[id]:", error);
    return NextResponse.json({ message: "خطایی در حذف اسلاید رخ داد" }, { status: 500 });
  }
}
