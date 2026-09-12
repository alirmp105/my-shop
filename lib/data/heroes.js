import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";

function serializeHero(hero) {
  if (!hero) return null;
  const image = hero.image || {};
  return {
    _id: hero._id.toString(),
    title: hero.title || "",
    subtitle: hero.subtitle || "",
    image: {
      url: image.url || (typeof image === "string" ? image : ""),
      publicId: image.publicId || hero.imagePublicId || "",
      type: image.type || "image",
    },
    button: {
      text: hero.button?.text || "مشاهده",
      href: hero.button?.href || "#",
    },
    order: hero.order ?? 0,
    isActive: hero.isActive ?? true,
    startAt: hero.startAt ? new Date(hero.startAt).toISOString() : null,
    endAt: hero.endAt ? new Date(hero.endAt).toISOString() : null,
    createdAt: hero.createdAt ? new Date(hero.createdAt).toISOString() : null,
    updatedAt: hero.updatedAt ? new Date(hero.updatedAt).toISOString() : null,
  };
}

async function getHeroesFromDB(filter = {}) {
  await connectDB();
  return Hero.find(filter).sort({ order: 1, createdAt: -1 }).lean();
}

export const getCachedActiveHeroes = unstable_cache(
  async () => {
    const now = new Date();
    const heroes = await getHeroesFromDB({
      isActive: true,
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
      ],
    });
    return heroes.map(serializeHero);
  },
  ["active-heroes"],
  { revalidate: 60, tags: ["heroes"] },
);

export async function getActiveHeroes() {
  return getCachedActiveHeroes();
}

export async function getAdminHeroes() {
  const heroes = await getHeroesFromDB();
  return heroes.map(serializeHero);
}

export const getHeroById = cache(async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  return serializeHero(await Hero.findById(id).lean());
});

export async function getHero(id) {
  return getHeroById(id);
}
