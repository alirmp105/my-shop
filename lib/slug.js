export function createSlug(value) {
  return value.trim().replace(/\s+/g, "-");
}
export function decodeSlug(rawSlug) {
  try {
    return decodeURIComponent(rawSlug);
  } catch {
    return rawSlug;
  }
}
