import type { Metadata } from "next";
import { KEYWORDS } from "../../content/keywords";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://phototourl.com";

export const baseMetadata: Metadata = {
  // 默认英文元数据；不同语言的标题/描述由 getLocaleMetadata 接收翻译结果覆盖
  title: "Photo To URL Converter | Turn photos into shareable links",
  description:
    "Free image hosting: convert photos to permanent URLs instantly. Supports JPG, PNG, WEBP, GIF up to 10MB. Clipboard paste, fast CDN, clean links for Markdown & HTML.",
  alternates: {
    canonical: `${siteUrl}/`,
    languages: {
      en: `${siteUrl}/`,
      zh: `${siteUrl}/zh`,
      es: `${siteUrl}/es`,
      fr: `${siteUrl}/fr`,
      pt: `${siteUrl}/pt`,
      de: `${siteUrl}/de`,
      jp: `${siteUrl}/jp`,
      ko: `${siteUrl}/ko`,
      ar: `${siteUrl}/ar`,
      rm: `${siteUrl}/rm`,
      ru: `${siteUrl}/ru`,
      hi: `${siteUrl}/hi`,
      id: `${siteUrl}/id`,
      ms: `${siteUrl}/ms`,
      uk: `${siteUrl}/uk`,
    } as Record<string, string>,
  },
  openGraph: {
    title: "Photo To URL Converter | Turn photos into shareable links",
    description:
      "Free image hosting: convert photos to permanent URLs instantly. Supports JPG, PNG, WEBP, GIF up to 10MB. Clipboard paste, fast CDN, clean links for Markdown & HTML.",
    url: `${siteUrl}/`,
    siteName: "Photo To URL",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Photo To URL Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo To URL Converter | Turn photos into shareable links",
    description:
      "Free image hosting: convert photos to permanent URLs instantly. Supports JPG, PNG, WEBP, GIF up to 10MB. Clipboard paste, fast CDN, clean links for Markdown & HTML.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        alt: "Photo To URL Converter",
      },
    ],
  },
  keywords: KEYWORDS,
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  other: {
    // Bing 站长验证
    "msvalidate.01": "9A675F33BD29DA6327CB3696B1CA322D",
    // 百度站长验证
    "baidu-site-verification": "codeva-ACSbhvu687",
  },
};

// 根据当前语言返回对应 canonical / OG url + 本地化标题/描述/关键词 的元数据
export function getLocaleMetadata(
  locale: string,
  title: string,
  description: string,
  keywords?: string[]
): Metadata {
  const alternates = baseMetadata.alternates || {};
  const languages =
    (alternates.languages as Record<string, string> | undefined) ?? {};

  const canonical =
    languages[locale] || (alternates.canonical as string) || `${siteUrl}/`;

  return {
    ...baseMetadata,
    title,
    description,
    keywords: keywords || baseMetadata.keywords,
    alternates: {
      ...alternates,
      canonical,
      languages,
    },
    openGraph: {
      ...(baseMetadata.openGraph || {}),
      title,
      description,
      url: canonical,
    },
    twitter: {
      ...(baseMetadata.twitter || {}),
      title,
      description,
    },
  };
}

