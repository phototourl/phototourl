import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/legal/privacy" : `/${locale}/legal/privacy`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Privacy Policy | Photo To URL",
    description: "Privacy Policy for Photo To URL.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Privacy Policy | Photo To URL",
      description: "Privacy Policy for Photo To URL.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Privacy Policy | Photo To URL",
      description: "Privacy Policy for Photo To URL.",
    },
  };
}

export { default } from "../../../(default)/legal/privacy/page";

