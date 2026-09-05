
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import category from "@/models/Category"
import brand from "@/models/Brand"
// تابع مشترک برای سریالایز
function serializeProduct(product) {
  if (!product) return null;
  
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price,
    stock: product.stock,
    category: product.category
      ? {
          _id: product.category._id.toString(),
          nameFa: product.category.nameFa || product.category.name || "",
          nameEn: product.category.nameEn || "",
          slug: product.category.slug,
        }
      : null,
    brand: product.brand
      ? {
          _id: product.brand._id.toString(),
          nameFa: product.brand.nameFa || "بدون برند",
          nameEn: product.brand.nameEn || "",
          slug: product.brand.slug,
        }
      : null,
    specifications: product.specifications ?? [],
    images: (product.images ?? []).map((image) => ({
      url: image.url,
      isPrimary: image.isPrimary,
    })),
    primaryImage: product.images?.find(img => img.isPrimary)?.url || null,
  };
}

// 1. ترندینگ با کش (بدون پارامتر - مناسب برای unstable_cache)
export const getCachedTrendProducts = unstable_cache(
  async () => {
    await connectDB();
    const products = await Product.find()
      .sort({ views: -1 })
      .limit(10)
      .lean();
    
    return products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      primaryImage: product.images?.find(img => img.isPrimary)?.url || null,
    }));
  },
  ['popular-products'],
  { revalidate: 3600 }
);

// 2. لیست محصولات با کش (بدون پارامتر - مناسب برای unstable_cache)
export const getCachedProducts = unstable_cache(
  async () => {
    await connectDB();
    const products = await Product.find()
      .populate("category")
      .populate("brand")
      .lean();
    
    return products.map(serializeProduct);
  },
  ['all-products'],
  { revalidate: 3600 }
);
export const getAdminProducts = 
  async () => {
    await connectDB();
    const products = await Product.find()
      .populate("category")
      .populate("brand")
      .lean();
    
    return products.map(serializeProduct);
  }

// 3. محصول تکی - استفاده از cache به جای unstable_cache
// چون پارامتر دارد و هر ID باید کش جداگانه داشته باشد
export const getProductById = cache(async (id) => {
  await connectDB();
  const product = await Product.findById(id)
    .populate("category")
    .populate("brand")
    .lean();
  
  return serializeProduct(product);
});

// 4. محصول تکی با Slug - استفاده از cache
export const getProductBySlug = cache(async (slug) => {
  await connectDB();
  const product = await Product.findOne({ slug })
    .populate("category")
    .populate("brand")
    .lean();
  
  return serializeProduct(product);
});

// توابع wrapper برای سازگاری با کد قبلی
export async function getProduct(id) {
  return getProductById(id);
}

export async function getProducts() {
  return getCachedProducts();
}


export async function getTrendProducts() {
  return getCachedTrendProducts();
}



