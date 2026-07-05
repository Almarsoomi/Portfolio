/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be served from GitHub Pages (also works on Vercel).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
