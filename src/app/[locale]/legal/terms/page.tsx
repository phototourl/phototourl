import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms.seo" });
  const canonicalPath = locale === "en" ? "/legal/terms" : `/${locale}/legal/terms`;
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.terms.page" });
  
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-slate-700">
        {t("content")}
      </p>
      <h2 className="mt-8 text-xl font-semibold">{t("disclaimer.title")}</h2>
      <p className="mt-2 text-slate-700">
        {t("disclaimer.text")}
      </p>
      <h2 className="mt-8 text-xl font-semibold">{t("contact.title")}</h2>
      <p className="mt-2 text-slate-700">
        {t("contact.text")} <a className="text-blue-600 hover:underline" href={`mailto:${t("contact.email")}`}>{t("contact.email")}</a>.
      </p>
    </LegalPage>
  );
}

