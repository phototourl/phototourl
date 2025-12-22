import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/contact" : `/${locale}/contact`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Contact | Photo To URL",
    description: "Contact Photo To URL support.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Contact | Photo To URL",
      description: "Contact Photo To URL support.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Contact | Photo To URL",
      description: "Contact Photo To URL support.",
    },
  };
}

export { default } from "../../(default)/contact/page";

