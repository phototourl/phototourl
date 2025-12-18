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
  "blog",
  "docs",
  "status",
  "contact",
  "faq",
  "legal/privacy",
  "legal/terms",
  "legal/impressum",
] as const;

// 生成多语言 hreflang 链接
function languagesMap(route: string) {
  const langRoute = route ? `/${route}` : "";

  // 以英文为默认 canonical，其他语言作为 alternate
  const defaultHref = `${baseUrl}${langRoute}`;

  const alternates = LOCALES.map((lang) => {
    const langPrefix = lang === "en" ? "" : `/${lang}`;
    return `<xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${langPrefix}${langRoute}" />`;
  }).join("");

  return `${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}" />`;
}

export async function GET() {
  const now = new Date().toISOString();
  const routes = [...staticPaths];

  const urls = routes
    .map((path) => {
      const route = path ? `/${path}` : "";
      const url = `${baseUrl}${route}`; // 使用英文 URL 作为 canonical
      const freq = path === "" ? "daily" : "weekly";
      const priority = path === "" ? "1.0" : "0.8";

      return `<url><loc>${url}</loc>${languagesMap(
        path
      )}<lastmod>${now}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("\n  ");

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
