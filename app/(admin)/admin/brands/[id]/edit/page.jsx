import BrandForm from "@/components/BrandForm";
import { getBrand } from "@/lib/data/brands";
const EditBrand =async ({params}) => {
    const {id} = await params;
    const brand = await getBrand(id)
    return (
        <div>
            <BrandForm brand={brand} mode="edit" />
        </div>
    );
};

export default EditBrand;