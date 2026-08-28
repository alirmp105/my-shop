import { getCategory } from "@/lib/data/categories";
import CategoryForm from "@/components/categories/CategoryForm";


const EditCategory = async ({ params }) => {
  const { id } = await params;
  const category = await getCategory(id);
  return <CategoryForm mode="edit" category={category} />;
};

export default EditCategory;
