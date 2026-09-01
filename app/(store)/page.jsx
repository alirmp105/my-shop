import { BrandsSlider } from "@/components/home/BrandsSlider";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { DiscountBanner } from "@/components/home/DiscountBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingProducts } from "@/components/home/TrendingProducts";

const Home = () => {
  return (
    <main className="" >
      <HeroSection />
      <CategoriesSection />
      <TrendingProducts />
      <DiscountBanner />
      <BrandsSlider />
    </main>
  );
};

export default Home;