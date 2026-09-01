import ProductList from "@/components/products/ProductList";
import { getAdminProducts, getProducts } from "@/lib/data/products";
import React from "react";


const ProductPage = async () => {
  const products = await getAdminProducts();
  // console.log("product list : ", products);
  


  return (
    <div>
      <h1 className="text-4xl">مدیریت محصولات :</h1>
     
      <ProductList products={products} />
    </div>
  );
};

export default ProductPage;
