"use client";

import { useState } from "react";
import { LocaleLink } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Crop, History } from "lucide-react";
import { UploadHistoryDrawer } from "./UploadHistoryDrawer";

export function HeaderNavWithHistory() {
  const t = useTranslations("common");
  const tCircleCrop = useTranslations("circleCrop");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center gap-2 sm:gap-3">
        <LocaleLink
          href="/circlecrop"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-teal-50 hover:text-brand-teal"
        >
          <Crop className="h-4 w-4 shrink-0" />
          <span>{tCircleCrop("title")}</span>
        </LocaleLink>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-teal-50 hover:text-brand-teal"
          aria-label={t("header.history")}
        >
          <History className="h-4 w-4" />
          <span>{t("header.history")}</span>
        </button>
      </nav>
      <UploadHistoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
