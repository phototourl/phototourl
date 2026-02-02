import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "about.seo" });
  
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/about`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/about`,
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations({ locale: "en", namespace: "about.page" });
  
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
