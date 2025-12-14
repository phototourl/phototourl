import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export default async function DefaultLocaleLayout({ children }: { children: ReactNode }) {
  // 默认语言：不跳转 /，直接渲染英文
  setRequestLocale(routing.defaultLocale);
  const messages = await getMessages();

  const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

  return (
    <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
      <SiteHeader />
      <main className="min-h-screen pt-14 sm:pt-16">{children}</main>
      <SiteFooter />
      <GoogleAnalytics />
      {analyticsDomain && analyticsSrc ? (
        <script defer data-domain={analyticsDomain} src={analyticsSrc}></script>
      ) : null}
    </NextIntlClientProvider>
  );
}


