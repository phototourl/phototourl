import { getRequestConfig } from "next-intl/server";
import { getMessagesForLocale } from "./messages";
import { routing, AppLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl 在不同版本里 requestLocale 可能是 string 或 Promise<string | undefined>
  const requested = await requestLocale;
  const locale = (routing.locales as readonly string[]).includes(requested ?? "")
    ? (requested as AppLocale)
    : routing.defaultLocale;

  const messages = await getMessagesForLocale(locale);

  return {
    locale,
    messages,
  };
});

