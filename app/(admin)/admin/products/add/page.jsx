import ProductForm from "@/components/ProductForm";
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
