// lib/data/products.js
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { unstable_cache } from "next/cache";
import { cache } from "react";

// ====================== SERIALIZE (خروجی یکسان) ======================
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
    primaryImage: product.images?.find((img) => img.isPrimary)?.url || null,
  };
}

// ====================== DATA FETCHER (مشترک) ======================
async function getProductsFromDB(filter = {}, options = {}) {
  await connectDB();
  return Product.find(filter)
    .populate("category")
    .populate("brand")
    .lean();
}

// ====================== CACHE FUNCTIONS ======================

// 1. لیست همه محصولات (کل پروژه - کش دائمی)
export const getCachedProducts = unstable_cache(
  async () => {
    const products = await getProductsFromDB({});
    return products.map(serializeProduct);
  },
  ["all-products"],
  { revalidate: 300 } // 5 min
);

// 2. محصولات ترندینگ
export const getCachedTrendProducts = unstable_cache(
  async () => {
    const products = await getProductsFromDB(
      {},
      { sort: { views: -1 }, limit: 10 }
    );
    return products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      primaryImage: product.images?.find((img) => img.isPrimary)?.url || null,
    }));
  },
  ["popular-products"],
  { revalidate: 300 }
);

// 3. محصول با Id (cache جداگانه)
export const getProductById = cache(async (id) => {
  const product = await getProductsFromDB({ _id: id });
  return serializeProduct(product[0]);
});

// 4. محصول با Slug (cache جداگانه)
export const getProductBySlug = cache(async (slug) => {
  const product = await getProductsFromDB({ slug });
  return serializeProduct(product[0]);
});

// ====================== WRAPPERS (برای سازگاری کد قدیمی) ======================
export async function getProducts() {
  return getCachedProducts();
}

export async function getTrendProducts() {
  return getCachedTrendProducts();
}

export async function getAdminProducts() {
  return getCachedProducts(); // حالا کش می‌شود!
}
