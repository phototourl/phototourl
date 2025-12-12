
import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { KEYWORDS } from "../../content/keywords";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = localFont({
  src: [
    { path: "./api/image/Inter/Inter-Thin.ttf", weight: "100", style: "normal" },
    { path: "./api/image/Inter/Inter-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "./api/image/Inter/Inter-Light.ttf", weight: "300", style: "normal" },
    { path: "./api/image/Inter/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./api/image/Inter/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./api/image/Inter/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./api/image/Inter/Inter-Bold.ttf", weight: "700", style: "normal" },
    { path: "./api/image/Inter/Inter-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./api/image/Inter/Inter-Black.ttf", weight: "900", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Photo to URL Converter | Turn photos into shareable links",
  description:
    "Upload photos and get clean, shareable URLs instantly. Fast, simple, reliable photo-to-link conversion for the web.",
  alternates: {
    canonical: "https://www.phototourl.com/",
  },
  openGraph: {
    title: "Photo to URL Converter",
    description:
      "Turn your photos into clean, shareable links in seconds. No signup required.",
    url: "https://www.phototourl.com/",
    siteName: "Photo to URL",
    images: [
      {
        url: "https://www.phototourl.com/og.png",
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
        url: "https://www.phototourl.com/og.png",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      
      <body className={`${inter.className} bg-slate-100 text-slate-900`}>
        <SiteHeader />
        <main className="min-h-screen pt-24">{children}</main>
        <SiteFooter />
        <GoogleAnalytics />
        {analyticsDomain && analyticsSrc ? (
          // Analytics injection point (configurable via env)
          <script
            defer
            data-domain={analyticsDomain}
            src={analyticsSrc}
          ></script>
        ) : null}
      </body>
    </html>
  );
}
