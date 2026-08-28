import React from "react";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

import ProductForm from "@/components/products/ProductForm";


// ---------------------------------------------
// دریافت یک محصول
// ---------------------------------------------

async function getProduct(id) {
  await connectDB();

  const product = await Product.findById(id)
    .populate("category")
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
          name: product.category.name,
        }
      : null,

    images: product.images.map((image) => ({
      url: image.url,
      isPrimary: image.isPrimary,
    })),
  };
}


// ---------------------------------------------
// دریافت دسته‌بندی‌ها
// ---------------------------------------------

async function getCategories() {
  await connectDB();

  const categories = await Category.find()
    .select("_id name")
    .lean();

  return categories.map((category) => ({
    _id: category._id.toString(),
    name: category.name,
  }));
}


// ---------------------------------------------
// Page
// ---------------------------------------------

const EditProductPage = async ({ params }) => {

  const { id } = await params;

  const [product, categories] =
    await Promise.all([
      getProduct(id),
      getCategories(),
    ]);

    console.log(product);
    


  if (!product) {
    return (
      <div>
        محصول موردنظر پیدا نشد.
      </div>
    );
  }


  return (
    <div>

      <h1 className="text-4xl mb-6">
        ویرایش محصول
      </h1>

      <ProductForm
        mode="edit"
        product={product}
        categories={categories}
      />

    </div>
  );
};

export default EditProductPage;

