"use client";

import { useEffect, useState } from "react";
import { X, Copy, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { getUploadHistory, type UploadHistoryItem } from "@/lib/upload-history";

type UploadHistoryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function formatTime(ts: number) {
  if (typeof window === "undefined") {
    // 服务器端渲染时返回固定格式，避免 hydration 错误
    return new Date(ts).toISOString();
  }
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function UploadHistoryDrawer({ open, onClose }: UploadHistoryDrawerProps) {
  const t = useTranslations("common");
  const [items, setItems] = useState<UploadHistoryItem[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && mounted) setItems(getUploadHistory());
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const gap = scrollbarWidth > 0 ? scrollbarWidth : 0;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${gap}px`;
    document.body.setAttribute("data-drawer-open", "true");
    document.body.style.setProperty("--scrollbar-gap", `${gap}px`);
    window.dispatchEvent(new CustomEvent("upload-history-drawer-change", { detail: { open: true } }));
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      document.body.removeAttribute("data-drawer-open");
      document.body.style.removeProperty("--scrollbar-gap");
      window.dispatchEvent(new CustomEvent("upload-history-drawer-change", { detail: { open: false } }));
    };
  }, [open]);

  useEffect(() => {
    if (!copiedUrl) return;
    const t = setTimeout(() => setCopiedUrl(null), 1500);
    return () => clearTimeout(t);
  }, [copiedUrl]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
  };

  if (!open || !mounted) return null;

  const isCopied = (url: string) => copiedUrl === url;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] bg-black/30 transition-opacity"
        aria-hidden
        onClick={onClose}
      />
      <aside
        className="fixed right-0 top-0 z-[9999] h-full w-full max-w-lg overflow-hidden bg-white shadow-xl transition-transform sm:max-w-xl"
        role="dialog"
        aria-label={t("history.drawerTitle")}
      >
        <div className="border-b border-white/15 hero-gradient flex h-14 flex-col justify-center px-4 sm:h-16">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white sm:text-lg">{t("history.drawerTitle")}</h2>
            <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/90 hover:bg-white/20 hover:text-white"
            aria-label={t("history.close")}
          >
            <X className="h-5 w-5" />
          </button>
          </div>
          <p className="mt-0.5 text-xs text-white/80">{t("history.hint")}</p>
        </div>
        <div className="custom-scrollbar max-h-[calc(100vh-3.5rem)] overflow-y-auto p-3 sm:max-h-[calc(100vh-4rem)]">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">{t("history.empty")}</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={`${item.url}-${item.timestamp}`}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <p className="truncate text-xs text-slate-500" title={item.url}>
                      {item.url}
                    </p>
                    <p className="mt-0.5 shrink-0 whitespace-nowrap text-xs text-slate-400" title={formatTime(item.timestamp)}>
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.url)}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      title={t("history.copy")}
                    >
                      {isCopied(item.url) ? (
                        <span className="text-xs text-brand-teal">{t("history.copied")}</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      title={t("history.open")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
