import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://phototourl.com";
const routes = [
  "/",
  "/blog",
  "/docs",
  "/status",
  "/contact",
  "/faq",
  "/legal/privacy",
  "/legal/terms",
  "/legal/impressum",
];
// 只输出已上线的第一、第二梯队语言
const locales = ["en", "zh", "es", "fr", "pt", "de", "ja", "ko"] as const;
const defaultLocale = "en";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  return routes.flatMap((path) =>
    locales.map((locale) => {
      const localizedPath =
        locale === defaultLocale
          ? path
          : `/${locale}${path === "/" ? "" : path}`;

      return {
        url: `${baseUrl}${localizedPath}`,
        lastModified,
      };
    })
  );
}

