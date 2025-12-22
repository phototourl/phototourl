import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/legal/terms" : `/${locale}/legal/terms`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Terms of Service | Photo To URL",
    description: "Terms of Service for Photo To URL.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Terms of Service | Photo To URL",
      description: "Terms of Service for Photo To URL.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Terms of Service | Photo To URL",
      description: "Terms of Service for Photo To URL.",
    },
  };
}

export { default } from "../../../(default)/legal/terms/page";

