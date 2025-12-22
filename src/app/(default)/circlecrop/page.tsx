import type { Metadata } from "next";
import { CircleCropTool } from "@/components/CircleCropTool";
import { SelectRegionSection } from "@/components/SelectRegionSection";
import { RateServiceSection } from "@/components/RateServiceSection";
import { PhotoToUrlLink } from "@/components/PhotoToUrlLink";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("circleCrop.seo");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PhotoCircleCropPage() {
  const t = await getTranslations("circleCrop.page");
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* 首屏 section - 确保至少占满一屏 */}
        <section className="relative min-h-screen pt-16 pb-32 sm:pb-40 lg:pb-48">
          <CircleCropTool showHeading={true} />
          
          <div className="mt-8">
            <div className="mx-auto max-w-4xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base leading-relaxed">
                {t("description")}
              </p>
            </div>
          </div>

          {/* Photo To URL Link - 绝对定位在文案和首屏底部的中间位置，参考首页的比例 */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none sm:bottom-20 lg:bottom-24">
            <PhotoToUrlLink />
          </div>
        </section>
      </div>

      {/* 首屏下方的元素 - 移出内层div，让渐变可以延伸到两边 */}
      <SelectRegionSection translationKey="circleCrop.selectRegion" />
      <RateServiceSection translationKey="circleCrop.rateService" />
    </div>
  );
}

