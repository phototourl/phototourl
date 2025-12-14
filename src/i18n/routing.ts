import { defineRouting } from "next-intl/routing";
import nextIntlConfig from "../../next-intl.config";

export const LOCALES = nextIntlConfig.locales;
export type AppLocale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: nextIntlConfig.locales,
  defaultLocale: nextIntlConfig.defaultLocale,
  localePrefix: nextIntlConfig.localePrefix,
});

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

