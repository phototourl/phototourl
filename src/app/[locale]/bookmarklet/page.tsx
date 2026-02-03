"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { siteUrl } from "@/app/seo-metadata";

export default function BookmarkletPage() {
  const t = useTranslations("bookmarklet");
  const [bookmarkletCode, setBookmarkletCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 生成 bookmarklet 代码
    const code = `javascript:(function(){var s=document.createElement('script');s.src='${siteUrl}/api/bookmarklet?t='+Date.now();document.head.appendChild(s);})();`;
    setBookmarkletCode(code);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmarkletCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        {t("title")}
      </h1>
      <p className="text-lg text-slate-600 mb-8">{t("description")}</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {t("howItWorks.title")}
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-slate-700">
          <li>{t("howItWorks.step1")}</li>
          <li>{t("howItWorks.step2")}</li>
          <li>{t("howItWorks.step3")}</li>
          <li>{t("howItWorks.step4")}</li>
        </ol>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {t("installation.title")}
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              {t("installation.step1.title")}
            </h3>
            <p className="text-slate-600 mb-3">{t("installation.step1.description")}</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-2">
              <code className="text-sm text-slate-800 break-all">
                {bookmarkletCode}
              </code>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {copied ? t("installation.copied") : t("installation.copy")}
            </button>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              {t("installation.step2.title")}
            </h3>
            <p className="text-slate-600 mb-3">{t("installation.step2.description")}</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
                <li>{t("installation.step2.chrome")}</li>
                <li>{t("installation.step2.firefox")}</li>
                <li>{t("installation.step2.safari")}</li>
                <li>{t("installation.step2.edge")}</li>
              </ol>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              {t("installation.step3.title")}
            </h3>
            <p className="text-slate-600">{t("installation.step3.description")}</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {t("usage.title")}
        </h2>
        <p className="text-slate-700 mb-3">{t("usage.description")}</p>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>{t("usage.feature1")}</li>
          <li>{t("usage.feature2")}</li>
          <li>{t("usage.feature3")}</li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>{t("note.title")}:</strong> {t("note.content")}
        </p>
      </div>
    </div>
  );
}
