/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be served from GitHub Pages (also works on Vercel).
  output: "export",
  // Set by the GitHub Pages workflow ("/Portfolio"); empty for local dev and Vercel.
  basePath: process.env.PAGES_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
