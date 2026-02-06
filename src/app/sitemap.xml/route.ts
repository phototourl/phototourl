import { NextResponse } from "next/server";
import { LOCALES } from "@/i18n/routing";

const FALLBACK_BASE_URL = "https://phototourl.com";
const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_BASE_URL).replace(
  /\/+$/,
  ""
);

// 与站点实际存在的页面保持一致
const staticPaths = [
  "",
  "circle-crop",
  "rounded-corners",
  "blog",
  "docs",
  "status",
  "contact",
  "faq",
  "about",
  "legal/privacy",
  "legal/terms",
  "legal/cookie",
  "legal/impressum",
] as const;

// 包含所有支持的语言
const SITEMAP_LOCALES = LOCALES;

export async function GET() {
  const now = new Date().toISOString();

  // 为每个语言 + 路由生成一个独立的 <url>，恢复之前 80+ 条 URL 的结构
  const urls = SITEMAP_LOCALES.flatMap((locale) => {
    const localePrefix = locale === "en" ? "" : `/${locale}`;

    return staticPaths.map((path) => {
      const route = path ? `/${path}` : "";
      const url = `${baseUrl}${localePrefix}${route}`;
      const freq = path === "" ? "daily" : "weekly";
      const priority = path === "" ? "1.0" : "0.8";

      return `<url><loc>${url}</loc><lastmod>${now}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
    });
  }).join("\n  ");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  ${urls}`,
    "</urlset>",
  ].join("\n");

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
