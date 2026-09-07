import AdBanners from "@/components/home/AdBanner";
import { BrandsSlider } from "@/components/home/BrandsSlider";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { DiscountBanner } from "@/components/home/DiscountBanner";
import HeroSection  from "@/components/home/HeroSection";
import Offer from "@/components/home/Offer";
import { TrendingProducts } from "@/components/home/TrendingProducts";

const Home = async () => {
   
  // await new Promise(resolve =>setTimeout(resolve,4000) ) loading test
  return (
    <main className="" >
      <HeroSection />
      <CategoriesSection />
      <AdBanners variant="pair" />
      <Offer />
      <TrendingProducts />
      <AdBanners variant="quad" />
      <DiscountBanner />
      <BrandsSlider />
    </main>
  );
};

export default Home;