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
  const t = await getTranslations({ locale, namespace: "legal.privacy.seo" });
  const canonicalPath = locale === "en" ? "/legal/privacy" : `/${locale}/legal/privacy`;
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

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.privacy.page" });
  
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-500">{t("lastUpdated")}</p>
      
      <section className="mt-6">
        <p className="text-slate-700 leading-relaxed">
          {t("introduction")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("dataCollection.title")}</h2>
        <p className="text-slate-700 mb-3">{t("dataCollection.content1")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-3">
          <li>{t("dataCollection.item1")}</li>
          <li>{t("dataCollection.item2")}</li>
          <li>{t("dataCollection.item3")}</li>
          <li>{t("dataCollection.item4")}</li>
        </ul>
        <p className="text-slate-700">{t("dataCollection.content2")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("dataUsage.title")}</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>{t("dataUsage.item1")}</li>
          <li>{t("dataUsage.item2")}</li>
          <li>{t("dataUsage.item3")}</li>
          <li>{t("dataUsage.item4")}</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("dataStorage.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("dataStorage.content")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("cookies.title")}</h2>
        <p className="text-slate-700 mb-3">{t("cookies.content1")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-3">
          <li>{t("cookies.item1")}</li>
          <li>{t("cookies.item2")}</li>
          <li>{t("cookies.item3")}</li>
        </ul>
        <p className="text-slate-700">{t("cookies.content2")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("thirdParty.title")}</h2>
        <p className="text-slate-700 mb-3">{t("thirdParty.content1")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-3">
          <li>{t("thirdParty.item1")}</li>
          <li>{t("thirdParty.item2")}</li>
          <li>{t("thirdParty.item3")}</li>
        </ul>
        <p className="text-slate-700">{t("thirdParty.content2")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("dataSecurity.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("dataSecurity.content")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("yourRights.title")}</h2>
        <p className="text-slate-700 mb-3">{t("yourRights.content")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>{t("yourRights.item1")}</li>
          <li>{t("yourRights.item2")}</li>
          <li>{t("yourRights.item3")}</li>
          <li>{t("yourRights.item4")}</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("children.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("children.content")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("changes.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("changes.content")}
        </p>
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

