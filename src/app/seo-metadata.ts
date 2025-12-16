import type { Metadata } from "next";
import { KEYWORDS } from "../../content/keywords";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://phototourl.com";

export const baseMetadata: Metadata = {
  title: "Photo to URL Converter | Turn photos into shareable links",
  description:
    "Upload photos and get clean, shareable URLs instantly. Fast, simple, reliable photo-to-link conversion for the web.",
  alternates: {
    canonical: `${siteUrl}/`,
    languages: {
      en: `${siteUrl}/`,
      zh: `${siteUrl}/zh`,
      es: `${siteUrl}/es`,
      fr: `${siteUrl}/fr`,
      pt: `${siteUrl}/pt`,
      de: `${siteUrl}/de`,
      ja: `${siteUrl}/jp`, // 使用标准 ISO 代码 ja，但 URL 路径保持 /jp
      ko: `${siteUrl}/ko`,
      ar: `${siteUrl}/ar`,
    },
  },
  openGraph: {
    title: "Photo to URL Converter",
    description:
      "Turn your photos into clean, shareable links in seconds. No signup required.",
    url: `${siteUrl}/`,
    siteName: "Photo to URL",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Photo to URL Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo to URL Converter",
    description:
      "Upload photos and get direct, shareable URLs instantly. Fast and reliable hosting.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        alt: "Photo to URL Converter",
      },
    ],
  },
  keywords: KEYWORDS,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    // Bing 站长验证
    "msvalidate.01": "9A675F33BD29DA6327CB3696B1CA322D",
    // 百度站长验证
    "baidu-site-verification": "codeva-ACSbhvu687",
  },
};

