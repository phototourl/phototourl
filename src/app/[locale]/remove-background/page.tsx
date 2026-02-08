import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { RemoveBackgroundTool } from "@/components/RemoveBackgroundTool";
import { SelectRegionSection } from "@/components/SelectRegionSection";
import { ScrollButtons } from "@/components/ScrollButtons";
import { siteUrl, getLocaleMetadata } from "@/app/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "removeBackground.seo" });
  const canonicalPath = locale === "en" ? "/remove-background" : `/${locale}/remove-background`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  // 从翻译文件中获取关键词字符串，转换为数组
  const keywordsString = t("keywords");
  const keywords = keywordsString && typeof keywordsString === "string" && keywordsString.trim()
    ? keywordsString.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];

  // 直接返回 metadata，确保 keywords 能覆盖 layout 的设置
  // 即使 keywords 为空数组，也要明确设置以覆盖 layout 的 keywords
  return getLocaleMetadata(locale, t("title"), t("description"), keywords.length > 0 ? keywords : []);
}

export default async function RemoveBackgroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "removeBackground.page" });
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 lg:px-10 bg-white">
        <section className="bg-white relative pt-4 pb-40 sm:pt-10 sm:pb-44 lg:pt-14 lg:pb-52">
          <RemoveBackgroundTool showHeading={true} />

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

      <SelectRegionSection translationKey="removeBackground.selectRegion" />
      <ScrollButtons />
    </>
  );
}
