import CategoryList from "@/components/categories/CategoryList";
import { getCategories } from "@/lib/data/categories";

const CategoriesPage = async () => {
  const categories = await getCategories();
  return <CategoryList categories={categories} />;
};

export default CategoriesPage;
