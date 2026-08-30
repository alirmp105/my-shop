import CategoryList from "@/components/categories/CategoryList";
import { cachedCategoreis, getCategories } from "@/lib/data/categories";

const CategoriesPage = async () => {
  const categories = await cachedCategoreis();
  return <CategoryList categories={categories} />;
};

export default CategoriesPage;
