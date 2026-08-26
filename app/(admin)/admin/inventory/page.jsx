import React from 'react';
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Inventory from '@/components/Inventory';
import Category from '@/models/Category';


// export async function getProducts() {
//   await connectDB();

//   const products = await Product.find().lean().populate("category");

//   return products.map((product) => ({
//     id: product._id.toString(),
//     name: product.name,
//     stock: product.stock,
//     category: product.category.name
//   }));
// }



export async function getProducts(status) {
  await connectDB();

  const filter = {};

  if (status === "available") {
    filter.stock = { $gt: 0 };
  }

  if (status === "out") {
    filter.stock = 0;
  }

  const products = await Product.find(filter)
    .populate("category")
    .sort({ createdAt: -1 });

  return products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    stock: product.stock,
    category: product.category?.name || "بدون دسته‌بندی",
  }));
}

const InventoryPage = async ({ searchParams }) => {
  const params = await searchParams;

  const status = params.status || "all";

  const products = await getProducts(status);

  return (
    <Inventory
      products={products}
    />
  );
};

export default InventoryPage;