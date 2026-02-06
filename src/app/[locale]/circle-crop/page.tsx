import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CircleCropTool } from "@/components/CircleCropTool";
import { SelectRegionSection } from "@/components/SelectRegionSection";
import { ScrollButtons } from "@/components/ScrollButtons";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "circleCrop.seo" });
  const canonicalPath = locale === "en" ? "/circle-crop" : `/${locale}/circle-crop`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: canonicalUrl },
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

export default async function PhotoCircleCropPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "circleCrop.page" });
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 lg:px-10 bg-white">
        <section className="bg-white relative pt-4 pb-40 sm:pt-10 sm:pb-44 lg:pt-14 lg:pb-52">
          <CircleCropTool showHeading={true} />

          <div className="mt-12">
            <div className="mx-auto max-w-5xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mx-auto max-w-5xl text-sm text-slate-600 sm:text-base leading-relaxed">
                {t("description")}
              </p>
            </div>
          </div>
        </section>
      </div>

      <SelectRegionSection translationKey="circleCrop.selectRegion" />
      <ScrollButtons />
    </>
  );
}
