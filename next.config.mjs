/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://picsum.photos/seed/store-hero-1/1600/900"),
      new URL("https://picsum.photos/seed/store-hero-2/1600/900"),
      new URL("https://picsum.photos/seed/store-hero-3/1600/900"),
    ],
  },
};

export default nextConfig;
