import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "en" ? "/blog" : `/${locale}/blog`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: "Blog | Photo To URL",
    description: "Articles about photo hosting, link sharing, and performance tips.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Blog | Photo To URL",
      description: "Articles about photo hosting, link sharing, and performance tips.",
      url: canonicalUrl,
    },
    twitter: {
      title: "Blog | Photo To URL",
      description: "Articles about photo hosting, link sharing, and performance tips.",
    },
  };
}

export { default } from "../../(default)/blog/page";

