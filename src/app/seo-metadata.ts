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
      ja: `${siteUrl}/ja`,
      ko: `${siteUrl}/ko`,
      ar: `${siteUrl}/ar`,
      ru: `${siteUrl}/ru`,
      id: `${siteUrl}/id`,
      th: `${siteUrl}/th`,
      vi: `${siteUrl}/vi`,
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
        url: `${siteUrl}/og.png`,
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
        url: `${siteUrl}/og.png`,
        alt: "Photo to URL Converter",
      },
    ],
  },
  keywords: KEYWORDS,
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-1.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon-1.png",
  },
};

