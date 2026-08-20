import AdsSection from "@/components/home/AdsSection";
import { BrandsSlider } from "@/components/home/BrandsSlider";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { DiscountBanner } from "@/components/home/DiscountBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingProducts } from "@/components/home/TrendingProducts";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <TrendingProducts />
      <AdsSection />
      <DiscountBanner />
      <BrandsSlider />
    </main>
  );
};

export default Home;