import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatToman(value) {
  return new Intl.NumberFormat("fa-IR").format(value ?? 0);
}
