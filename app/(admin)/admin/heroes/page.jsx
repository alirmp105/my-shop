import { Suspense } from "react";
import HeroList from "@/components/heroes/HeroList";
import { getAdminHeroes } from "@/lib/data/heroes";

export const dynamic = "force-dynamic";

export default async function HeroesPage() {
  const heroes = await getAdminHeroes();
  return <Suspense fallback={<div>در حال بارگذاری...</div>}><HeroList heroes={heroes} /></Suspense>;
}
