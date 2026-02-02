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
  const t = await getTranslations({ locale, namespace: "legal.cookie.seo" });
  const canonicalPath = locale === "en" ? "/legal/cookie" : `/${locale}/legal/cookie`;
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

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.cookie.page" });
  
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
        <h2 className="text-xl font-semibold mb-4">{t("whatAreCookies.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("whatAreCookies.content")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("howWeUseCookies.title")}</h2>
        <p className="text-slate-700 mb-3">{t("howWeUseCookies.content")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>{t("howWeUseCookies.item1")}</li>
          <li>{t("howWeUseCookies.item2")}</li>
          <li>{t("howWeUseCookies.item3")}</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("typesOfCookies.title")}</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("typesOfCookies.essential.title")}</h3>
            <p className="text-slate-700 leading-relaxed">
              {t("typesOfCookies.essential.content")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("typesOfCookies.analytics.title")}</h3>
            <p className="text-slate-700 leading-relaxed">
              {t("typesOfCookies.analytics.content")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("typesOfCookies.advertising.title")}</h3>
            <p className="text-slate-700 leading-relaxed">
              {t("typesOfCookies.advertising.content")}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("thirdPartyCookies.title")}</h2>
        <p className="text-slate-700 mb-3">{t("thirdPartyCookies.content")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>{t("thirdPartyCookies.item1")}</li>
          <li>{t("thirdPartyCookies.item2")}</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("manageCookies.title")}</h2>
        <p className="text-slate-700 leading-relaxed">
          {t("manageCookies.content")}
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
