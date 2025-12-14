"use client";

import { useParams } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { LocaleLink, useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

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

export function LanguageSwitcher() {
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

  return (
    <div className="relative flex items-center text-sm" ref={dropdownRef}>
      <button
        type="button"
        className="ez-btn-gradient flex h-9 items-center gap-1.5 rounded-md border-0 px-2 text-sm text-white outline-none transition focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:opacity-50 sm:h-10 sm:px-3"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
      >
        <span className="whitespace-nowrap">{currentLocale.label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-white/90" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-auto min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-lg">
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

