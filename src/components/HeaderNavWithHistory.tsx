"use client";

import { LocaleLink, useLocalePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Circle, LayoutDashboard, SquareRoundCorner, Sparkles } from "lucide-react";

const navLinkBase =
  "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-teal-50 hover:text-brand-teal sm:px-2.5 sm:py-1.5 sm:text-sm";
const navLinkActive = "bg-teal-50 text-brand-teal";

export function HeaderNavWithHistory() {
  const t = useTranslations("common");
  const pathname = useLocalePathname();
  const isHome = pathname === "/" || pathname === "";
  const isCircleCrop = pathname === "/circle-crop" || pathname.startsWith("/circle-crop");
  const isRoundedCorners = pathname === "/rounded-corners" || pathname.startsWith("/rounded-corners");
  const isRemoveBackground = pathname === "/remove-background" || pathname.startsWith("/remove-background");

  return (
    <nav className="ml-2 flex items-center gap-1.5 sm:gap-3 sm:ml-6">
      <LocaleLink
        href="/"
        className={`${navLinkBase} ${isHome ? navLinkActive : "text-slate-600"}`}
      >
        <LayoutDashboard className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{t("header.home")}</span>
      </LocaleLink>
      <LocaleLink
        href="/circle-crop"
        className={`${navLinkBase} ${isCircleCrop ? navLinkActive : "text-slate-600"}`}
      >
        <Circle className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{t("header.circleCropNav")}</span>
      </LocaleLink>
      <LocaleLink
        href="/rounded-corners"
        className={`${navLinkBase} ${isRoundedCorners ? navLinkActive : "text-slate-600"}`}
      >
        <SquareRoundCorner className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{t("header.roundedCorners")}</span>
      </LocaleLink>
      <LocaleLink
        href="/remove-background"
        className={`${navLinkBase} ${isRemoveBackground ? navLinkActive : "text-slate-600"}`}
      >
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{t("header.removeBackgroundNav")}</span>
      </LocaleLink>
    </nav>
  );
}
