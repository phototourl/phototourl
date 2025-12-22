import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/legal/impressum" : `/${locale}/legal/impressum`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Impressum | Photo To URL",
    description: "Impressum for Photo To URL.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Impressum | Photo To URL",
      description: "Impressum for Photo To URL.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Impressum | Photo To URL",
      description: "Impressum for Photo To URL.",
    },
  };
}

export { default } from "../../../(default)/legal/impressum/page";

