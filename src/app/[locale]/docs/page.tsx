import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/docs" : `/${locale}/docs`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Docs | Photo To URL",
    description: "Documentation for Photo To URL.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Docs | Photo To URL",
      description: "Documentation for Photo To URL.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Docs | Photo To URL",
      description: "Documentation for Photo To URL.",
    },
  };
}

export { default } from "../../(default)/docs/page";

