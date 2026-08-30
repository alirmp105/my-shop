import ProductForm from "@/components/products/ProductForm";
import {getCategories } from "@/lib/data/categories";


const AddProduct = async () => {
  const categories = await getCategories();
  
  return (
    <div>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
};

export default AddProduct;
