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
  const t = await getTranslations({ locale, namespace: "about.seo" });
  const canonicalPath = locale === "en" ? "/about" : `/${locale}/about`;
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about.page" });
  
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("mission.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("mission.content")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("features.title")}</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>{t("features.item1")}</li>
          <li>{t("features.item2")}</li>
          <li>{t("features.item3")}</li>
          <li>{t("features.item4")}</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("contact.title")}</h2>
        <p className="text-slate-700">
          {t("contact.text")}{" "}
          <a className="text-blue-600 hover:underline" href={`mailto:${t("contact.email")}`}>
            {t("contact.email")}
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
