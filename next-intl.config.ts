// 上线语种（按业务优先级排序）
// 1) English 2) 简体中文 3) Spanish 4) French
// 5) Portuguese（Brazil）6) German 7) Japanese 8) Korean
// + Arabic（保留）
export const locales = ["en", "zh", "es", "fr", "pt", "de", "jp", "ko", "ar"] as const;

export const defaultLocale = "en" as const;

// 默认语言不加前缀：/ 直接是英文；其他语言用 /zh /fr ...
export const localePrefix = "as-needed" as const;

export default {
  locales,
  defaultLocale,
  localePrefix,
};

