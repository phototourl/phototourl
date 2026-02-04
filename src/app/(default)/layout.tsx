import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { routing } from "@/i18n/routing";
import { getLocaleMetadata } from "../seo-metadata";

export const dynamic = "force-static";

// 默认语言首页：使用 messages 中的本地化标题/描述 + canonical
export async function generateMetadata() {
  const locale = routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seo.home" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });
  
  // 从翻译文件中获取关键词字符串，转换为数组
  const keywordsString = tSeo("keywords");
  const keywords = keywordsString && typeof keywordsString === "string" && keywordsString !== "keywords" && keywordsString.trim()
    ? keywordsString.split(",").map((k: string) => k.trim()).filter(Boolean)
    : undefined;
  
  return getLocaleMetadata(locale, t("title"), t("description"), keywords);
}

export default async function DefaultLocaleLayout({ children }: { children: ReactNode }) {
  // 默认语言：不跳转 /，直接渲染英文
  setRequestLocale(routing.defaultLocale);
  const messages = await getMessages();

  const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

  const locale = routing.defaultLocale;
  const Header = await SiteHeader({ locale });
  const Footer = await SiteFooter({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {Header}
      <main className="min-h-screen pt-14 sm:pt-16">{children}</main>
      {Footer}
      <GoogleAnalytics />
      {analyticsDomain && analyticsSrc ? (
        <script defer data-domain={analyticsDomain} src={analyticsSrc}></script>
      ) : null}
    </NextIntlClientProvider>
  );
}

