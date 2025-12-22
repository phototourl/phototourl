// 上线语种（按业务优先级排序）
// 1) English 2) 简体中文 3) 繁體中文 4) Turkish 5) Czech
// 6) Spanish 7) French 8) Portuguese（Brazil）9) German 10) Japanese 11) Korean
// + Arabic（保留）+ Italian + Dutch + Polish + Swedish + Thai + Vietnamese
export const locales = ["en", "zh", "zh-TW", "tr", "cs", "es", "fr", "pt", "de", "jp", "ko", "ar", "it", "nl", "pl", "sv", "th", "vi", "rm", "ru", "hi", "id", "ms", "uk"] as const;

export const defaultLocale = "en" as const;

// 默认语言不加前缀：/ 直接是英文；其他语言用 /zh /fr ...
export const localePrefix = "as-needed" as const;

export default {
  locales,
  defaultLocale,
  localePrefix,
};

