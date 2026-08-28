import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";

function serializeCategory(category) {
  return {
    _id: category._id.toString(),
    nameFa: category.nameFa || category.name || "",
    nameEn: category.nameEn || "",
    image: category.image,
    slug: category.slug,
    isActive: category.isActive ?? true,
  };
}

export async function getCategories() {
  await connectDB();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();

  return categories.map(serializeCategory);
}

export const cachedCategoreis = unstable_cache(
  async () => getCategories(),
  ["categories"],
  { revalidate: 3600 },
);

export async function getCategory(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectDB();
  const category = await Category.findById(id).lean();

  if (!category) return null;

  return serializeCategory(category);
}
