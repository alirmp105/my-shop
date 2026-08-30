import React from "react";

import Product from "@/models/Product";
import Category from "@/models/Category";

import ProductForm from "@/components/products/ProductForm";
import { cachedCategoreis } from "@/lib/data/categories";
import { getProduct } from "@/lib/data/products";



const EditProductPage = async ({ params }) => {

  const { id } = await params;

  const [product, categories] =
    await Promise.all([
      await getProduct(id),
      await cachedCategoreis(),
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
