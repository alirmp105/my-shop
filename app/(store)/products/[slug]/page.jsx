import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import { decodeSlug } from "@/lib/slug";
import Product from "@/models/Product";

import "@/models/Category";
import "@/models/Brand";

import { ProductDetail } from "@/components/products/detail/ProductDetail";

async function getProduct(rawSlug) {
  await connectDB();


  const slug = decodeSlug(rawSlug);

  const product = await Product.findOne({ slug })
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .lean();

  if (!product) return null;

  return {
    id: product._id.toString(),
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    stock: product.stock ?? 0,
    images: product.images ?? [], 
    specifications: product.specifications ?? [],
    category: product.category
      ? { id: product.category._id.toString(), name: product.category.name, slug: product.category.slug }
      : null,
    brand: product.brand
      ? { id: product.brand._id.toString(), name: product.brand.name, slug: product.brand.slug }
      : null,
    rating: product.rating ?? null,
    ratingCount: product.ratingCount ?? null,
    reviewCount: product.reviewCount ?? null,
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "محصول یافت نشد" };
  }

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
