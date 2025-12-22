import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/faq" : `/${locale}/faq`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "FAQ | Photo To URL",
    description: "Frequently asked questions about Photo To URL.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "FAQ | Photo To URL",
      description: "Frequently asked questions about Photo To URL.",
      url: canonicalUrl,
    },
    twitter: {
      title: "FAQ | Photo To URL",
      description: "Frequently asked questions about Photo To URL.",
    },
  };
}

export { default } from "../../(default)/faq/page";

