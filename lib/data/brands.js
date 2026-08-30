import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";

// import { unstable_cache } from "next/cache";
// import mongoose from "mongoose";
export async function getBrands(params) {
  await connectDB();
  const brands = await Brand.find();

  return brands.map((brand) => ({
    _id: brand._id.toString(),
    nameFa: brand.nameFa,
    nameEn: brand.nameEn,
    image : brand.image,
    slug : brand.slug,
  }));
}

unstable_cache( async () =>{
return getBrands() 
})
export async function getBrand (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
await connectDB();
  const brand = await Brand.findById(id);

   if (!brand) return null;

  return {
    _id: brand._id.toString(),
    nameFa: brand.nameFa,
    nameEn: brand.nameEn,
    slug : brand.slug,
    image : brand.image
    
  };
}
