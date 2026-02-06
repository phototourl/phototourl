"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const ANIM_DURATION_MS = 200;

type LocaleItem = { code: string; label: string; countryCode: string };

const LOCALES: LocaleItem[] = [
  { code: "en", label: "English", countryCode: "US" },
  { code: "tr", label: "Türkçe", countryCode: "TR" },
  { code: "cs", label: "Čeština", countryCode: "CZ" },
  { code: "es", label: "Español", countryCode: "ES" },
  { code: "fr", label: "Français", countryCode: "FR" },
  { code: "pt", label: "Português", countryCode: "PT" },
  { code: "de", label: "Deutsch", countryCode: "DE" },
  { code: "jp", label: "日本語", countryCode: "JP" },
  { code: "ko", label: "한국어", countryCode: "KR" },
  { code: "ar", label: "العربية", countryCode: "SA" },
  { code: "it", label: "Italiano", countryCode: "IT" },
  { code: "nl", label: "Nederlands", countryCode: "NL" },
  { code: "pl", label: "Polski", countryCode: "PL" },
  { code: "sv", label: "Svenska", countryCode: "SE" },
  { code: "th", label: "ไทย", countryCode: "TH" },
  { code: "vi", label: "Tiếng Việt", countryCode: "VN" },
  { code: "zh", label: "简体中文", countryCode: "CN" },
  { code: "zh-TW", label: "繁體中文", countryCode: "TW" },
  { code: "rm", label: "Rumantsch", countryCode: "CH" },
  { code: "ru", label: "Русский", countryCode: "RU" },
  { code: "hi", label: "हिन्दी", countryCode: "IN" },
  { code: "id", label: "Bahasa Indonesia", countryCode: "ID" },
  { code: "ms", label: "Bahasa Melayu", countryCode: "MY" },
  { code: "uk", label: "Українська", countryCode: "UA" },
  { code: "bg", label: "Български", countryCode: "BG" },
  { code: "ca", label: "Català", countryCode: "ES" },
  { code: "da", label: "Dansk", countryCode: "DK" },
  { code: "el", label: "Ελληνικά", countryCode: "GR" },
  { code: "fi", label: "Suomi", countryCode: "FI" },
  { code: "he", label: "עברית", countryCode: "IL" },
  { code: "hr", label: "Hrvatski", countryCode: "HR" },
  { code: "hu", label: "Magyar", countryCode: "HU" },
  { code: "no", label: "Norsk", countryCode: "NO" },
  { code: "ro", label: "Română", countryCode: "RO" },
  { code: "sk", label: "Slovenčina", countryCode: "SK" },
  { code: "tl", label: "Tagalog", countryCode: "PH" },
];

// 国旗图标组件
const FlagIcon = ({ countryCode, className }: { countryCode: string; className?: string }) => {
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${countryCode.toLowerCase()}.svg`}
      alt={countryCode}
      className={`inline-block ${className || "h-4 w-4"}`}
      style={{ display: "inline-block" }}
    />
  );
};

type LanguageSelectModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LanguageSelectModal({ open, onClose }: LanguageSelectModalProps) {
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const params = useParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 进入动画：挂载后下一帧再显示，触发 transition
  useEffect(() => {
    if (!open) return;
    setExiting(false);
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(rafId);
  }, [open]);

  // 关闭动画：先播完再真正 onClose
  const startClose = () => {
    if (closeTimeoutRef.current) return;
    setExiting(true);
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null;
      setEntered(false);
      onClose();
    }, ANIM_DURATION_MS);
  };

  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const gap = scrollbarWidth > 0 ? scrollbarWidth : 0;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${gap}px`;
    document.body.setAttribute("data-modal-open", "true");
    document.body.style.setProperty("--scrollbar-gap", `${gap}px`);
    window.dispatchEvent(new CustomEvent("language-modal-change", { detail: { open: true } }));
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      document.body.removeAttribute("data-modal-open");
      document.body.style.removeProperty("--scrollbar-gap");
      window.dispatchEvent(new CustomEvent("language-modal-change", { detail: { open: false } }));
    };
  }, [open]);

  const handleLocaleChange = (newLocale: string) => {
    if (pathname.includes("/circlecrop")) {
      sessionStorage.setItem("circleCropLanguageSwitch", "true");
    }
    if (pathname === "/" || pathname === "") {
      sessionStorage.setItem("homePageLanguageSwitch", "true");
    }
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLocale }
      );
    });
    startClose();
  };

  if (!open) return null;

  return (
    <>
      {/* 背景遮罩：淡入 / 淡出 */}
      <div
        className="fixed inset-0 z-[9998] bg-black/30 transition-opacity duration-200 ease-out"
        style={{
          opacity: entered && !exiting ? 1 : 0,
        }}
        onClick={startClose}
        aria-hidden="true"
      />
      {/* 弹框：缩放 + 淡入 / 淡出；移动端限制高度并让列表可滚动 */}
      <div
        className="fixed left-1/2 top-1/2 z-[9999] flex max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out sm:max-w-4xl"
        style={{
          opacity: entered && !exiting ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${entered && !exiting ? 1 : 0.95})`,
        }}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* 头部：不滚动 */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h2 id="language-modal-title" className="text-lg font-semibold text-slate-900">
              {t("languageSelect.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("languageSelect.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={startClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label={t("languageSelect.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 语言列表：可滚动 */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {LOCALES.map((item) => {
              const isSelected = item.code === locale;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLocaleChange(item.code)}
                  disabled={isPending}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base transition-colors ${
                    isSelected
                      ? "bg-brand-teal/10 text-brand-teal font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <FlagIcon countryCode={item.countryCode} className="h-6 w-6 shrink-0" />
                  <span className="flex-1 break-words">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
