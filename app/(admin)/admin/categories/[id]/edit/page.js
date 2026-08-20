import CategoryForm from "@/components/CategoryForm";
import { getCategory } from "@/lib/data/categories";





export async function generateMetadata({params}) {
  console.log(params);
  const {id} = await params;
  console.log("id : " , id) ;
  
  
 const category = await getCategory(id);
 console.log("cafgdjsj : " , category);
 

   return {
    name : `
   ویرایش دسته بندی با آیدی  : ${category.id}
    `,
   }
}


const EditCategory = async ({params}) => {
const {id} = await params;
const category = await getCategory(id)

  return <div>
    <CategoryForm mode="edit" category={category} />
  </div>;
};

export default EditCategory;
