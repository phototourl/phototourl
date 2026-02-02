// 支持36种语言
export const locales = ["en", "zh", "zh-TW", "tr", "cs", "es", "fr", "pt", "de", "jp", "ko", "ar", "it", "nl", "pl", "sv", "th", "vi", "rm", "ru", "hi", "id", "ms", "uk", "bg", "ca", "da", "el", "fi", "he", "hr", "hu", "no", "ro", "sk", "tl"] as const;

export const defaultLocale = "en" as const;

// 默认语言不加前缀：/ 直接是英文；其他语言用 /zh /fr ...
export const localePrefix = "as-needed" as const;

export default {
  locales,
  defaultLocale,
  localePrefix,
};

