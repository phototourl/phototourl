import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/status" : `/${locale}/status`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Status | Photo To URL",
    description: "Service status for Photo To URL.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Status | Photo To URL",
      description: "Service status for Photo To URL.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Status | Photo To URL",
      description: "Service status for Photo To URL.",
    },
  };
}

export { default } from "../../(default)/status/page";

