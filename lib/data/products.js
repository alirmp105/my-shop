import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { unstable_cache } from "next/cache";

import Category from "@/models/Category";


export async function getTrendProducts() {
  await connectDB();

  const products = await Product.find().sort({views : -1}).lean().limit(10);

  return products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    slug : product.slug,
    price: product.price,
    stock : product.stock,
    primaryImage : product.images.find((image)=>image.isPrimary)?.url || null
  }));
}   

 unstable_cache(
  async () => {
    return getTrendProducts()
  }, ['popular-products'] , {
    revalidate : 3600
  }
)

export async function getProducts() {
  await connectDB();

  const products = await Product.find()
    .populate("category")
    .populate("brand");

  return products.map((product) => ({
    _id: product._id.toString(),
    nameFa: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price,
    stock: product.stock,
    category: product.category?.nameFa || product.category?.name || "بدون دسته‌بندی",
    brand: product.brand?.nameFa || null,
    primaryImage : product.images.find((image)=>image.isPrimary)?.url || null
  }));
}


export async function getProduct(id) {
  await connectDB();

  const product = await Product.findById(id)
    .populate("category")
    .populate("brand")
    .lean();

  if (!product) {
    return null;
  }

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
        }
      : null,

    brand: product.brand
      ? {
          _id: product.brand._id.toString(),
          nameFa: product.brand.nameFa || "",
          nameEn: product.brand.nameEn || "",
        }
      : null,

    images: product.images.map((image) => ({
      url: image.url,
      isPrimary: image.isPrimary,
    })),
  };
}

// export const getCachedProduct = unstable_cache(
//   async () => {
//     return getProduct(id) , [id]
//   }
// )

