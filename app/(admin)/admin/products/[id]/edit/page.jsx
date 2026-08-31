import React from "react";

import Product from "@/models/Product";
import Category from "@/models/Category";

import ProductForm from "@/components/products/ProductForm";
import { getCategories } from "@/lib/data/categories";
import { getBrands } from "@/lib/data/brands";
import { getProduct } from "@/lib/data/products";



const EditProductPage = async ({ params }) => {

  const { id } = await params;

  const [product, categories, brands] =
    await Promise.all([
      await getProduct(id),
      await getCategories(),
      await getBrands(),
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
        brands={brands}
      />

    </div>
  );
};

export default EditProductPage;
