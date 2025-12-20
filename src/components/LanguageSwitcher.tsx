"use client";

import { useParams } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { LocaleLink, useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";


type LocaleItem = { code: string; label: string; countryCode: string };

const LOCALES: LocaleItem[] = [
  { code: "en", label: "English", countryCode: "US" },
  { code: "de", label: "Deutsch (German)", countryCode: "DE" },
  { code: "es", label: "Español (Spanish)", countryCode: "ES" },
  { code: "fr", label: "Français (French)", countryCode: "FR" },
  { code: "ar", label: "العربية (Arabic)", countryCode: "SA" },
  { code: "pt", label: "Português (Portuguese)", countryCode: "PT" },
  { code: "ja", label: "日本語 (Japanese)", countryCode: "JP" },
  { code: "zh", label: "中文(简体)", countryCode: "CN" },
  { code: "ko", label: "한국어 (Korean)", countryCode: "KR" },
  { code: "it", label: "Italiano (Italian)", countryCode: "IT" },
  { code: "zh-TW", label: "中文(繁體)", countryCode: "TW" },
  { code: "tr", label: "Türkçe (Turkish)", countryCode: "TR" },
  { code: "nl", label: "Nederlands (Dutch)", countryCode: "NL" },
  { code: "pl", label: "Polski (Polish)", countryCode: "PL" },
  { code: "vi", label: "Tiếng Việt (Vietnamese)", countryCode: "VN" },
  { code: "th", label: "ไทย (Thai)", countryCode: "TH" },
  { code: "cs", label: "Čeština (Czech)", countryCode: "CZ" },
  { code: "sv", label: "Svenska (Swedish)", countryCode: "SE" },
];

// 国旗图标组件
const FlagIcon = ({ countryCode, className }: { countryCode: string; className?: string }) => (
  <ReactCountryFlag
    countryCode={countryCode}
    svg
    style={{
      width: "1.2em",
      height: "1.2em",
    }}
    className={className}
  />
);

type LanguageSwitcherProps = {
  /** 
   * header: 顶部导航样式（原来的绿色按钮，向下展开）
   * footer: 底部简洁样式（只文字+图标，向上展开）
   */
  variant?: "header" | "footer";
};

export function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const params = useParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = LOCALES.find((item) => item.code === locale) || LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLocale }
      );
    });
    setIsOpen(false);
  };

  const isFooter = variant === "footer";

  return (
    <div className="relative inline-flex items-center text-sm" ref={dropdownRef}>
      <button
        type="button"
        className={
          isFooter
            ? // 底部样式：无背景，仅文字+图标
              "flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm sm:text-base outline-none transition hover:opacity-80 disabled:opacity-50"
            : // 头部样式：原来的绿色渐变按钮
              "ez-btn-gradient flex h-9 items-center gap-1.5 rounded-md border-0 px-2 text-sm text-white outline-none transition focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:opacity-50 sm:h-10 sm:px-3"
        }
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
      >
        <FlagIcon countryCode={currentLocale.countryCode} className="shrink-0" />
        <span className={isFooter ? "whitespace-nowrap" : "whitespace-nowrap"}>
          {currentLocale.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${isFooter ? "" : "text-white/90"}`}
        />
      </button>

      {isOpen && (
        <div
          className={
            isFooter
              ? // 底部：向上展开，避免被底部栏挡住
                "absolute right-0 bottom-full z-50 mb-1 w-auto min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg"
              : // 头部：保持原来向下展开
                "absolute right-0 top-full z-50 mt-1 w-auto min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg"
          }
        >
          {LOCALES.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                item.code === locale
                  ? "bg-brand-teal/10 text-brand-teal font-medium"
                  : "text-slate-900 hover:bg-slate-50"
              }`}
              onClick={() => handleLocaleChange(item.code)}
            >
              <FlagIcon countryCode={item.countryCode} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LanguageLinksInline() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
      {LOCALES.map((item) => (
        <LocaleLink
          key={item.code}
          href="/"
          locale={item.code as any}
          className="rounded-full border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50"
        >
          {item.label}
        </LocaleLink>
      ))}
    </div>
  );
}

