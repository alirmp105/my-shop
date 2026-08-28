import ProductForm from "@/components/products/ProductForm";
import { cachedCategoreis } from "@/lib/data/categories";


const AddProduct = async () => {
  const categories = await cachedCategoreis();
  
  return (
    <div>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
};

export default AddProduct;
