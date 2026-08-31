import ProductForm from "@/components/products/ProductForm";
import { getCategories } from "@/lib/data/categories";
import { getBrands } from "@/lib/data/brands";


const AddProduct = async () => {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);
  
  return (
    <div>
      <ProductForm 
        mode="create" 
        categories={categories} 
        brands={brands}
      />
    </div>
  );
};

export default AddProduct;
