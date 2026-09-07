import { getProducts } from "@/lib/data/products";
import IncredibleOffers from "./IncredibleOffers";


const Offer =async () => {
    const products = await getProducts()
    return (
      <IncredibleOffers products={products} />
    );
};

export default Offer;