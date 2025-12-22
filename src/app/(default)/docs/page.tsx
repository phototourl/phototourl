import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "docs.seo" });
  const canonicalPath = "/docs";
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function DocsPage() {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "docs.page" });
  
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
      <p className="mt-3 text-slate-600">
        {t("description")}
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <div className="font-semibold mb-2">{t("features.title")}</div>
        <ul className="list-disc pl-5">
          <li>{t("features.items.1")}</li>
          <li>{t("features.items.2")}</li>
          <li>{t("features.items.3")}</li>
        </ul>
      </div>
    </div>
  );
}


