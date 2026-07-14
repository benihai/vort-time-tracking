/** @type {import('next').NextConfig} */

// Static export for GitHub Pages. The app runs entirely client-side and talks
// to Supabase directly from the browser (RLS protects the data). In production
// the site lives under /vort-time-tracking (the repo name), so basePath +
// assetPrefix are set; in local dev they're empty.
const repo = "vort-time-tracking";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
};

module.exports = nextConfig;
