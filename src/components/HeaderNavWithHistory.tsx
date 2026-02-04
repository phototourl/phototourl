"use client";

import { LocaleLink, useLocalePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Crop, Home } from "lucide-react";

const navLinkBase =
  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-teal-50 hover:text-brand-teal";
const navLinkActive = "bg-teal-50 text-brand-teal";

export function HeaderNavWithHistory() {
  const t = useTranslations("common");
  const pathname = useLocalePathname();
  const isHome = pathname === "/" || pathname === "";
  const isCircleCrop = pathname === "/circlecrop" || pathname.startsWith("/circlecrop");

  return (
    <nav className="ml-4 flex items-center gap-2 sm:gap-3 sm:ml-6">
      <LocaleLink
        href="/"
        className={`${navLinkBase} ${isHome ? navLinkActive : "text-slate-600"}`}
      >
        <Home className="h-4 w-4 shrink-0" />
        <span>{t("header.home")}</span>
      </LocaleLink>
      <LocaleLink
        href="/circlecrop"
        className={`${navLinkBase} ${isCircleCrop ? navLinkActive : "text-slate-600"}`}
      >
        <Crop className="h-4 w-4 shrink-0" />
        <span>{t("header.circleCrop")}</span>
      </LocaleLink>
    </nav>
  );
}
