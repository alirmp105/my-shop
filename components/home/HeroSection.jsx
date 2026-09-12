import { getActiveHeroes } from "@/lib/data/heroes";
import HeroCarousel from "./HeroCarousel";

export default async function HeroSection() {
  const heroes = await getActiveHeroes();
  return <HeroCarousel heroes={heroes} />;
}
