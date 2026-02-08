"use client";

import { LocaleLink, useLocalePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Circle, LayoutDashboard, SquareRoundCorner, Sparkles, BookOpen, Home } from "lucide-react";

const navLinkBase =
  "flex items-center justify-center gap-1 whitespace-nowrap rounded-lg text-xs font-medium transition-colors hover:bg-teal-50 hover:text-brand-teal h-8 w-8 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-2 sm:text-sm md:h-10 md:px-2.5";
const navLinkActive = "bg-teal-50 text-brand-teal";

export function HeaderNavWithHistory() {
  const t = useTranslations("common");
  const pathname = useLocalePathname();
  const isHome = pathname === "/" || pathname === "";
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog");
  const isCircleCrop = pathname === "/circle-crop" || pathname.startsWith("/circle-crop");
  const isRoundedCorners = pathname === "/rounded-corners" || pathname.startsWith("/rounded-corners");
  const isRemoveBackground = pathname === "/remove-background" || pathname.startsWith("/remove-background");

  return (
    <nav className="flex items-center gap-0.5 shrink-0 sm:gap-1.5 md:gap-3">
      <LocaleLink
        href="/"
        className={`${navLinkBase} ${isHome ? navLinkActive : "text-slate-600"}`}
      >
        <Home className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">{t("header.home")}</span>
      </LocaleLink>
      <LocaleLink
        href="/blog"
        className={`${navLinkBase} ${isBlog ? navLinkActive : "text-slate-600"}`}
      >
        <BookOpen className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">{t("header.blog")}</span>
      </LocaleLink>
      <LocaleLink
        href="/circle-crop"
        className={`${navLinkBase} ${isCircleCrop ? navLinkActive : "text-slate-600"}`}
      >
        <Circle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">{t("header.circleCropNav")}</span>
      </LocaleLink>
      <LocaleLink
        href="/rounded-corners"
        className={`${navLinkBase} ${isRoundedCorners ? navLinkActive : "text-slate-600"}`}
      >
        <SquareRoundCorner className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">{t("header.roundedCorners")}</span>
      </LocaleLink>
      <LocaleLink
        href="/remove-background"
        className={`${navLinkBase} ${isRemoveBackground ? navLinkActive : "text-slate-600"}`}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">{t("header.removeBackgroundNav")}</span>
      </LocaleLink>
    </nav>
  );
}
