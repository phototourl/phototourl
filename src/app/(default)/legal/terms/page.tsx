import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "legal.terms.seo" });
  
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/legal/terms`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/legal/terms`,
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function TermsPage() {
  const t = await getTranslations({ locale: "en", namespace: "legal.terms.page" });
  
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


