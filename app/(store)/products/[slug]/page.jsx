import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
// import مستقیم (side-effect) برای اطمینان از register شدن مدل‌های
// ارجاع‌شده قبل از populate — اگر پروژه‌ی شما این مدل‌ها را جای دیگری
// (مثلاً یک models/index.js مرکزی) از قبل register می‌کند، این دو خط
// اضافی هستند اما بی‌ضرر.
import "@/models/Category";
import "@/models/Brand";

import { ProductDetail } from "@/components/products/detail/ProductDetail";

/**
 * محصول را با slug می‌خواند و به یک آبجکت ساده و قابل‌سریالایز
 * (برای عبور از Server به Client) تبدیل می‌کند.
 *
 * ⚠️ فرض‌های این تابع را با ساختار واقعی مدل Product خودتان تطبیق دهید:
 *   - فرض شده product.images آرایه‌ای از رشته (URL) است. اگر در پروژه‌ی
 *     شما آرایه‌ای از آبجکت (مثلاً { url, isPrimary }) است، خط images
 *     را پایین‌تر با map مناسب جایگزین کنید.
 *   - فرض شده category/brand هرکدام فیلدهای name و slug دارند.
 *   - rating / ratingCount / reviewCount فعلاً در مدل شما وجود ندارند؛
 *     چون درخواست شده مدل تغییر نکند، این‌ها همیشه null/undefined
 *     برمی‌گردند تا ProductInfo بتواند UI متناسب با «بدون داده» را نشان دهد.
 */
async function getProduct(slug) {
  await connectDB();

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
    images: product.images ?? [], // ← در صورت نیاز با ساختار واقعی تطبیق دهید
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
