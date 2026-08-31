import { ProductGallery } from "@/components/products/detail/ProductGallery";
import { ProductInfo } from "@/components/products/detail/ProductInfo";
import { ProductPurchaseCard } from "@/components/products/detail/ProductPurchaseCard";
import { ProductSpecifications } from "@/components/products/detail/ProductSpecifications";
import { ProductDescription } from "@/components/products/detail/ProductDescription";
import { ProductReviews } from "@/components/products/detail/ProductReviews";

/**
 * چیدمان اصلی صفحه جزئیات محصول. خودش Server Component است — فقط
 * ProductGallery (state انتخاب تصویر) و ProductPurchaseCard (تعامل سبد
 * خرید) در سمت کلاینت رندر می‌شوند.
 *
 * نکته RTL: ترتیب DOM عمداً Gallery → Info → PurchaseCard است. چون کل
 * برنامه dir="rtl" دارد، مرورگر ستون اول grid را به‌صورت خودکار در
 * سمت راست صفحه قرار می‌دهد — یعنی همان چیدمان رایج فروشگاه‌های فارسی
 * (گالری راست، اطلاعات وسط، خرید چپ) بدون نیاز به کلاس یا ترفند اضافه
 * به‌دست می‌آید.
 */
export function ProductDetail({ product }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* بخش اصلی: گالری / اطلاعات / کارت خرید */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr_320px]">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
        <ProductPurchaseCard product={product} />
      </div>

      {/* بخش‌های پایین صفحه */}
      <div className="mt-12 space-y-10 border-t pt-10 lg:mt-16">
        <ProductSpecifications specifications={product.specifications} />
        <ProductDescription description={product.description} />
        <ProductReviews reviewCount={product.reviewCount} />
      </div>
    </div>
  );
}
