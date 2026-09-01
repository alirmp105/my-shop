export function decodeSlug(rawSlug) {
  try {
    return decodeURIComponent(rawSlug);
  } catch {
    return rawSlug;
  }
}
