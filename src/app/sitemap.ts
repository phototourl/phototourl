import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phototourl.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  return [
    { url: `${baseUrl}/`, lastModified },
    { url: `${baseUrl}/blog`, lastModified },
    { url: `${baseUrl}/docs`, lastModified },
    { url: `${baseUrl}/status`, lastModified },
    { url: `${baseUrl}/contact`, lastModified },
  ];
}

