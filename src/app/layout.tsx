
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { KEYWORDS } from "../../content/keywords";

const inter = Inter({ subsets: ["latin"] });

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
    images: ["https://www.phototourl.com/og.png"],
  },
  keywords: KEYWORDS,
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
