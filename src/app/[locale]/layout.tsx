import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { routing, type AppLocale } from "@/i18n/routing";
import type { ReactNode } from "react";
import { getLocaleMetadata } from "../seo-metadata";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 多语言路由：为不同 locale 输出对应 canonical / OG url + 本地化 title/description
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return getLocaleMetadata(locale, t("title"), t("description"));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Locale Layout
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#layout
 *
 * NextIntlClientProvider 不传递 locale 和 messages，会自动从 getRequestConfig 获取
 * https://next-intl.dev/docs/usage/configuration#nextintlclientprovider
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  // 关键：让 next-intl 在本次请求中使用当前 locale，并显式提供 messages（next-intl v3 需要）
  setRequestLocale(locale);
  const messages = await getMessages();

  const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

  const Header = await SiteHeader();
  const Footer = await SiteFooter();

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
