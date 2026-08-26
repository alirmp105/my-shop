import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { unstable_cache } from "next/cache";


export async function getTrendProducts() {
  await connectDB();

  const products = await Product.find().sort({views : -1}).lean().limit(10);

  return products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    stock : product.stock,
    primaryImage : product.images.find((image)=>image.isPrimary)?.url || null
  }));
}   

 unstable_cache(
  async () => {
    return getTrendProducts()
  }, ['popular-products'] , {
    revalidate : 3600
  }
)
