import type { AbstractIntlMessages as Messages } from "next-intl";
import { routing } from "./routing";
import { merge } from "../utils/deepMerge";

type Locale = (typeof routing.locales)[number];

const importLocale = async (locale: Locale): Promise<Messages> => {
  return (await import(`../../messages/${locale}.json`)).default as Messages;
};

export const getDefaultMessages = async (): Promise<Messages> => {
  return importLocale(routing.defaultLocale);
};

export const getMessagesForLocale = async (locale: Locale): Promise<Messages> => {
  const localeMessages = await importLocale(locale);
  if (locale === routing.defaultLocale) {
    return localeMessages;
  }
  const defaultMessages = await getDefaultMessages();
  return merge(defaultMessages, localeMessages);
};

