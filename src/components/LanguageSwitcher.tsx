"use client";

import { useParams } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { LocaleLink, useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { LanguageSelectModal } from "./LanguageSelectModal";


type LocaleItem = { code: string; label: string; countryCode: string };

const LOCALES: LocaleItem[] = [
  { code: "en", label: "English", countryCode: "US" },
  { code: "zh", label: "中文(简体)", countryCode: "CN" },
  { code: "zh-TW", label: "中文(繁體)", countryCode: "TW" },
  { code: "tr", label: "Türkçe (Turkish)", countryCode: "TR" },
  { code: "cs", label: "Čeština (Czech)", countryCode: "CZ" },
  { code: "es", label: "Español (Spanish)", countryCode: "ES" },
  { code: "fr", label: "Français (French)", countryCode: "FR" },
  { code: "pt", label: "Português (Portuguese)", countryCode: "PT" },
  { code: "de", label: "Deutsch (German)", countryCode: "DE" },
  { code: "jp", label: "日本語 (Japanese)", countryCode: "JP" },
  { code: "ko", label: "한국어 (Korean)", countryCode: "KR" },
  { code: "ar", label: "العربية (Arabic)", countryCode: "SA" },
  { code: "it", label: "Italiano (Italian)", countryCode: "IT" },
  { code: "nl", label: "Nederlands (Dutch)", countryCode: "NL" },
  { code: "pl", label: "Polski (Polish)", countryCode: "PL" },
  { code: "sv", label: "Svenska (Swedish)", countryCode: "SE" },
  { code: "th", label: "ไทย (Thai)", countryCode: "TH" },
  { code: "vi", label: "Tiếng Việt (Vietnamese)", countryCode: "VN" },
  { code: "rm", label: "Rumantsch (Romansh)", countryCode: "CH" },
  { code: "ru", label: "Русский (Russian)", countryCode: "RU" },
  { code: "hi", label: "हिन्दी (Hindi)", countryCode: "IN" },
  { code: "id", label: "Indonesia (Indonesian)", countryCode: "ID" },
  { code: "ms", label: "Melayu (Malay)", countryCode: "MY" },
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
  { code: "tl", label: "Tagalog (Filipino)", countryCode: "PH" },
];

// 国旗图标组件
const FlagIcon = ({ countryCode, className, label }: { countryCode: string; className?: string; label?: string }) => {
  const countryName = label || countryCode;
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${countryCode.toLowerCase()}.svg`}
      alt={countryName}
      title={countryName}
      aria-label={countryName}
      style={{
        width: "1.2em",
        height: "1.2em",
        display: "inline-block",
      }}
      className={className}
    />
  );
};

type LanguageSwitcherProps = {
  /** 
   * header: 顶部导航样式（原来的绿色按钮，向下展开）
   * footer: 底部简洁样式（只文字+图标，向上展开）
   * modal: 弹框模式（居中显示）
   */
  variant?: "header" | "footer" | "modal";
  /** 是否显示弹框（仅当 variant="modal" 时有效） */
  showModal?: boolean;
  /** 弹框关闭回调（仅当 variant="modal" 时有效） */
  onModalClose?: () => void;
};

export function LanguageSwitcher({ variant = "header", showModal = false, onModalClose }: LanguageSwitcherProps) {
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const params = useParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentLocale = LOCALES.find((item) => item.code === locale) || LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // 禁用 body 滚动
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      document.addEventListener("mousedown", handleClickOutside);
      // 滚动到选中的语言项
      setTimeout(() => {
        if (selectedButtonRef.current) {
          selectedButtonRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 0);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        // 恢复 body 滚动
        document.body.style.overflow = originalStyle;
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const _handleLocaleChange = (newLocale: string) => {
    // 如果当前在 circlecrop 页面，设置标记以保留图片缓存
    if (pathname.includes('/circlecrop')) {
      sessionStorage.setItem('circleCropLanguageSwitch', 'true');
    }
    // 如果当前在 roundedcorners 页面，设置标记以保留图片缓存
    if (pathname.includes('/roundedcorners')) {
      sessionStorage.setItem('roundedCornersLanguageSwitch', 'true');
    }
    // 如果当前在首页，设置标记以保留图片状态
    if (pathname === '/' || pathname === '') {
      sessionStorage.setItem('homePageLanguageSwitch', 'true');
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
    setIsOpen(false);
  };

  const isFooter = variant === "footer";
  const isModal = variant === "modal";

  // 如果是弹框模式，直接返回弹框组件
  if (isModal) {
    return <LanguageSelectModal open={showModal} onClose={onModalClose || (() => {})} />;
  }

  // 处理弹框关闭
  const handleModalClose = () => {
    setIsModalOpen(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  return (
    <>
      <div className="relative inline-flex items-center text-sm" ref={dropdownRef}>
        <button
          type="button"
          className={
            isFooter
              ? "flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm sm:text-base outline-none transition hover:opacity-80 disabled:opacity-50 active:scale-[0.98]"
              : "ez-btn-gradient flex h-9 items-center gap-1.5 rounded-md border-0 px-2 text-sm text-white outline-none transition focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.98] sm:h-10 sm:px-3"
          }
          onClick={() => {
            setIsModalOpen(true);
          }}
          disabled={isPending}
        >
        <FlagIcon countryCode={currentLocale.countryCode} className="shrink-0" label={currentLocale.label} />
        {variant === "header" ? (
          // Header：移动端只显示国旗，桌面端显示语言名称
          <span className="hidden sm:inline whitespace-nowrap">
            {currentLocale.label}
          </span>
        ) : (
          <span className="whitespace-nowrap">
            {currentLocale.label}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${isFooter ? "" : "text-white/90"} ${
            variant === "header" ? "hidden sm:inline-block" : ""
          }`}
        />
      </button>

      </div>
      {/* 语言选择弹框 */}
      <LanguageSelectModal open={isModalOpen} onClose={handleModalClose} />
    </>
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

