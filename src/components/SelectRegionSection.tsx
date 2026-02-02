"use client";

import { useLocale, useTranslations } from "next-intl";
import { useLocaleRouter, useLocalePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectRegionSectionProps {
  translationKey?: string; // 默认为 "home.selectRegion"，可以传入 "circleCrop.selectRegion"
}

export function SelectRegionSection({ translationKey = "home.selectRegion" }: SelectRegionSectionProps) {
  const locale = useLocale();
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const params = useParams();
  const t = useTranslations(translationKey);

  const languages = [
    { code: "en", label: "English", countryCode: "US" },
    { code: "de", label: "Deutsch (German)", countryCode: "DE" },
    { code: "rm", label: "Rumantsch (Romansh)", countryCode: "CH" },
    { code: "es", label: "Español (Spanish)", countryCode: "ES" },
    { code: "fr", label: "Français (French)", countryCode: "FR" },
    { code: "ar", label: "العربية (Arabic)", countryCode: "SA" },
    { code: "pt", label: "Português (Portuguese)", countryCode: "PT" },
    { code: "jp", label: "日本語 (Japanese)", countryCode: "JP" },
    { code: "zh", label: "简体中文 (Simplified Chinese)", countryCode: "CN" },
    { code: "ko", label: "한국어 (Korean)", countryCode: "KR" },
    { code: "it", label: "Italiano (Italian)", countryCode: "IT" },
    { code: "zh-TW", label: "繁體中文 (Traditional Chinese)", countryCode: "TW" },
    { code: "tr", label: "Türkçe (Turkish)", countryCode: "TR" },
    { code: "nl", label: "Nederlands (Dutch)", countryCode: "NL" },
    { code: "pl", label: "Polski (Polish)", countryCode: "PL" },
    { code: "vi", label: "Tiếng Việt (Vietnamese)", countryCode: "VN" },
    { code: "th", label: "ไทย (Thai)", countryCode: "TH" },
    { code: "cs", label: "Čeština (Czech)", countryCode: "CZ" },
    { code: "sv", label: "Svenska (Swedish)", countryCode: "SE" },
    { code: "ru", label: "Русский (Russian)", countryCode: "RU" },
    { code: "hi", label: "हिन्दी (Hindi)", countryCode: "IN" },
    { code: "id", label: "Indonesia", countryCode: "ID" },
    { code: "ms", label: "Melayu", countryCode: "MY" },
    { code: "uk", label: "Українська (Ukrainian)", countryCode: "UA" },
    { code: "bg", label: "Български (Bulgarian)", countryCode: "BG" },
    { code: "ca", label: "Català (Catalan)", countryCode: "ES" },
    { code: "da", label: "Dansk (Danish)", countryCode: "DK" },
    { code: "el", label: "Ελληνικά (Greek)", countryCode: "GR" },
    { code: "fi", label: "Suomi (Finnish)", countryCode: "FI" },
    { code: "he", label: "עברית (Hebrew)", countryCode: "IL" },
    { code: "hr", label: "Hrvatski (Croatian)", countryCode: "HR" },
    { code: "hu", label: "Magyar (Hungarian)", countryCode: "HU" },
    { code: "no", label: "Norsk (Norwegian)", countryCode: "NO" },
    { code: "ro", label: "Română (Romanian)", countryCode: "RO" },
    { code: "sk", label: "Slovenčina (Slovak)", countryCode: "SK" },
    { code: "tl", label: "Tagalog", countryCode: "PH" },
  ];

  return (
    <section className="py-16 section-bg-purple">
      <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">{t("title")}</h3>
            <p className="text-sm text-slate-600">{t("subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {languages.map((item) => {
              const isSelected = locale === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    router.replace(
                      // @ts-expect-error -- TypeScript will validate that only known `params` are used
                      { pathname, params },
                      { locale: item.code }
                    );
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-left text-xs sm:text-sm font-medium transition-all",
                    "hover:shadow-md hover:-translate-y-0.5",
                    isSelected
                      ? "border-brand-teal bg-brand-teal/10 text-brand-teal shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-teal/50 hover:bg-slate-50"
                  )}
                >
                  <img
                    src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${item.countryCode.toLowerCase()}.svg`}
                    alt={item.label}
                    title={item.label}
                    aria-label={item.label}
                    style={{ width: "1.2em", height: "1.2em", display: "inline-block" }}
                    className="shrink-0"
                  />
                  <span className="flex-1 text-xs sm:text-sm break-words">{item.label.split(" (")[0]}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-brand-teal" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

