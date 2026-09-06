// lib/data/categories.js

import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

function serializeCategory(category) {
  if (!category) return null;

  return {
    _id: category._id.toString(),
    nameFa: category.nameFa || category.name || "",
    nameEn: category.nameEn || "",
    image: category.image || null,
    slug: category.slug,
    isActive: category.isActive ?? true,
  };
}

// لیست کش‌شده برای بخش عمومی سایت
export const getCachedCategories = unstable_cache(
  async () => {
    await connectDB();

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .lean();

    return categories.map(serializeCategory);
  },
  ["all-categories"],
  {
    revalidate: 3600,
    tags: ["categories"],
  },
);

// لیست بدون کش برای پنل ادمین
export async function getAdminCategories() {
  await connectDB();

  const categories = await Category.find()
    .sort({ createdAt: -1 })
    .lean();

  return categories.map(serializeCategory);
}

// دریافت یک دسته‌بندی با ID
export const getCategoryById = cache(async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectDB();

  const category = await Category.findById(id).lean();

  return serializeCategory(category);
});

// دریافت یک دسته‌بندی با slug
export const getCategoryBySlug = cache(async (slug) => {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  await connectDB();

  const category = await Category.findOne({ slug }).lean();

  return serializeCategory(category);
});

// Wrapper برای بخش عمومی
export async function getCategories() {
  return getCachedCategories();
}

// Wrapper برای سازگاری با کد فعلی
export async function getCategory(id) {
  return getCategoryById(id);
}
