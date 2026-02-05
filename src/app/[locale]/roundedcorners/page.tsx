import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import NextImage from "next/image";
import { ScrollButtons } from "@/components/ScrollButtons";

export default async function RoundedCornersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "roundedCorners" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 lg:px-10 bg-white">
        <section className="bg-white relative pt-16 pb-40 sm:pt-20 sm:pb-44 lg:pt-24 lg:pb-52">
          <div className="flex flex-col">
            <div className="space-y-3 text-center mb-12">
              <h1 className="flex items-center justify-center gap-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                <div className="h-8 w-8 rounded-xl overflow-hidden sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <NextImage
                    src="/rounded-corners.png"
                    alt={t("title")}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                {t("title")}
              </h1>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
                {t("description")}
              </p>
              <p className="mt-6 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-500">
                {tCommon("header.comingSoon")}
              </p>
            </div>
          </div>
        </section>
      </div>
      <ScrollButtons />
    </>
  );
}
