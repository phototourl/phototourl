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
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:ring-offset-2 sm:h-10 sm:px-3"
          aria-label={t("header.history")}
        >
          <History className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">{t("header.history")}</span>
        </button>
        <LanguageSwitcher variant="header" />
      </div>
      <UploadHistoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
