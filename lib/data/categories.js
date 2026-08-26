import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { unstable_cache } from "next/cache";
import mongoose from "mongoose";
export async function getCategories(params) {
  await connectDB();
  const categories = await Category.find();

  return categories.map((category) => ({
    _id: category._id.toString(),
    name: category.name,
    image : category.image,
    slug : category.slug,
  }));
}

export const cachedCategoreis = unstable_cache(
  async () => {
    return getCategories()
  }, ['categories'] , {
    revalidate : 3600
  }
)


export async function getCategory (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
await connectDB();
  const category = await Category.findById(id);

   if (!category) return null;

  return {
    _id: category._id.toString(),
    name: category.name,
    slug : category.slug,
    image : category.image
    
  };
}


export const cachedCategory = unstable_cache(
  async () => {
    return getCategory()
  }, ['categories'] , {
    revalidate : 3600
  }
)

