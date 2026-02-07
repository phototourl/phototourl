import type { Metadata } from "next";
import { CircleCropTool } from "@/components/CircleCropTool";
import { SelectRegionSection } from "@/components/SelectRegionSection";
import { ScrollButtons } from "@/components/ScrollButtons";
import { getTranslations } from "next-intl/server";
import { siteUrl } from "@/app/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("circleCrop.seo");
  const canonicalUrl = `${siteUrl}/circle-crop`;
  
  // 从翻译文件中获取关键词字符串，转换为数组
  const keywordsString = t("keywords");
  const keywords = keywordsString && typeof keywordsString === "string" && keywordsString.trim()
    ? keywordsString.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];

  return {
    title: t("title"),
    description: t("description"),
    keywords: keywords.length > 0 ? keywords : [],
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

export default async function PhotoCircleCropPage() {
  const t = await getTranslations("circleCrop.page");
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
