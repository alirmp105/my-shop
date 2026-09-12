import HeroForm from "@/components/heroes/HeroForm";
import { getHero } from "@/lib/data/heroes";

export default async function EditHeroPage({ params }) {
  const { id } = await params;
  const hero = await getHero(id);
  if (!hero) return <p>اسلاید پیدا نشد</p>;
  return <HeroForm mode="edit" hero={hero} />;
}
