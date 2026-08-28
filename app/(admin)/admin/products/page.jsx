import ProductList from "@/components/products/ProductList";
import React from "react";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";


export async function getProducts() {
  await connectDB();

  const products = await Product.find().populate("category");

  return products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price,
    stock: product.stock,
    category: product.category?.name,
    primaryImage : product.images.find((image)=>image.isPrimary)?.url || null
  }));
}

const ProductPage = async () => {
  const products = await getProducts();
  console.log(products);

  return (
    <div>
      <h1 className="text-4xl">مدیریت محصولات :</h1>
     
      <ProductList products={products} />
    </div>
  );
};

export default ProductPage;
