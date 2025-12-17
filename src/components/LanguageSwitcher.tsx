"use client";

import { useParams } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { LocaleLink, useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

// 自定义地球图标 SVG
const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

type LocaleItem = { code: string; label: string };

const LOCALES: LocaleItem[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文(简体)" },
  { code: "es", label: "Español (Spanish)" },
  { code: "fr", label: "Français (French)" },
  { code: "pt", label: "Português (Portuguese)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "jp", label: "日本語 (Japanese)" },
  { code: "ko", label: "한국어 (Korean)" },
  { code: "ar", label: "العربية (Arabic)" },
];

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
        <GlobeIcon
          className={
            isFooter
              ? "h-5 w-5 shrink-0"
              : "h-5 w-5 shrink-0 text-white/90"
          }
        />
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
                "absolute right-0 bottom-full z-50 mb-1 w-auto min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-lg"
              : // 头部：保持原来向下展开
                "absolute right-0 top-full z-50 mt-1 w-auto min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-lg"
          }
        >
          {LOCALES.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                item.code === locale
                  ? "bg-brand-teal/10 text-brand-teal font-medium"
                  : "text-slate-900 hover:bg-slate-50"
              }`}
              onClick={() => handleLocaleChange(item.code)}
            >
              {item.label}
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

