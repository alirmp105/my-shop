// lib/data/brands.js
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { cache } from "react";

// ====================== SERIALIZE (خروجی یکسان) ======================
function serializeBrand(brand) {
  if (!brand) return null;

  return {
    _id: brand._id.toString(),
    nameFa: brand.nameFa,
    nameEn: brand.nameEn || "",
    slug: brand.slug,
    image: brand.image || null,
  };
}

// ====================== DATA FETCHER (مشترک) ======================
async function getBrandsFromDB(filter = {}) {
  await connectDB();
  return Brand.find(filter).lean();
}

// ====================== CACHE FUNCTIONS ======================

// 1. لیست همه برندها (کش ۱ ساعته — نتیجه assign شده، برخلاف قبل!)
export const getCachedBrands = unstable_cache(
  async () => {
    const brands = await getBrandsFromDB();
    return brands.map(serializeBrand);
  },
  ["all-brands"],
  { revalidate: 3600 }
);

// 2. برند با Id — اعتبارسنجی ObjectId + dedupe در سطح هر request
export const getBrandById = cache(async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const brand = await Brand.findById(id).lean();
  return serializeBrand(brand);
});

// 3. برند با Slug — برای صفحات عمومی مثل /brands/[slug]
export const getBrandBySlug = cache(async (slug) => {
  const brand = await Brand.findOne({ slug }).lean();
  return serializeBrand(brand);
});

// ====================== WRAPPERS (سازگاری با کد قبلی) ======================
export async function getBrands() {
  return getCachedBrands();
}

export async function getBrand(id) {
  return getBrandById(id);
}

export async function getAdminBrands (){
  connectDB();

  const brands = await Brand.find().lean();
  
  return brands.map(serializeBrand)
}
