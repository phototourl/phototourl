import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phototourl.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  return [
    { url: `${baseUrl}/`, lastModified, changefreq: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified, changefreq: "weekly", priority: 0.7 },
    { url: `${baseUrl}/docs`, lastModified, changefreq: "weekly", priority: 0.7 },
    { url: `${baseUrl}/status`, lastModified, changefreq: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified, changefreq: "monthly", priority: 0.5 },
  ];
}

