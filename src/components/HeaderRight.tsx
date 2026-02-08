"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { History } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UploadHistoryDrawer } from "./UploadHistoryDrawer";

export function HeaderRight() {
  const t = useTranslations("common");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:ring-offset-2 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-2 md:h-10 md:px-2.5"
          aria-label={t("header.history")}
          title=""
        >
          <History className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline whitespace-nowrap">{t("header.history")}</span>
        </button>
        <LanguageSwitcher variant="header" />
      </div>
      <UploadHistoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
