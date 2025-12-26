"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  ArrowUpRight,
  Copy,
  FileText,
  FileJson,
  FileCode2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LocaleLink } from "@/i18n/navigation";

type UploadState = "idle" | "uploading" | "success" | "error";

type PhotoToUrlToolProps = {
  /** 是否显示标题和描述 */
  showHeading?: boolean;
  /** 是否显示使用说明等额外内容 */
  showExtraContent?: boolean;
};

export function PhotoToUrlTool({ showHeading = true, showExtraContent = false }: PhotoToUrlToolProps) {
  const t = useTranslations("home");
  const tImages = useTranslations("images");

  const [status, setStatus] = useState<UploadState>("idle");
  const [_error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [animatingSample, setAnimatingSample] = useState<{ src: string; key: string } | null>(null);

  // 示例图片
  const SAMPLE_IMAGES = [
    { src: "/projects/sample-1.png", key: "sample-1" },
    { src: "/projects/sample-2.png", key: "sample-2" },
    { src: "/projects/sample-3.png", key: "sample-3" },
    { src: "/projects/sample-4.png", key: "sample-4" },
  ];

  const handleUpload = useCallback(async (file: File) => {
    setStatus("uploading");
    setError(null);
    setUrl(null);
    setFileName(file.name);
    setOriginalFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setStatus("success");
      setUrl(data.url);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, []);

  const uploadSample = useCallback(
    async (src: string, fileNameForUi: string) => {
      setAnimatingSample({ src, key: fileNameForUi });
      setStatus("uploading");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error("Sample fetch failed");
        const blob = await res.blob();
        const extFromType = blob.type?.split("/")?.[1];
        const ext = extFromType && extFromType.length <= 5 ? extFromType : "png";
        const file = new File([blob], `sample-${fileNameForUi}.${ext}`, { type: blob.type || "image/png" });
        await handleUpload(file);
        setAnimatingSample(null);
      } catch {
        setStatus("error");
        setError(t("result.error"));
        setAnimatingSample(null);
      }
    },
    [handleUpload, t]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const file = Array.from(e.clipboardData.files || [])[0];
    if (file) {
      void handleUpload(file);
    }
  };

  const copyUrl = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const saveUrlAsTxt = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    const blob = new Blob([url], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phototourl-link.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const saveUrlAsJson = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    const content = JSON.stringify({ link: url }, null, 2);
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phototourl-link.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const saveUrlAsMd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    const content = `[Photo To URL link](${url})\n`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phototourl-link.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const clearUpload = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setStatus("idle");
    setError(null);
    setUrl(null);
    setFileName(null);
    setPreview(null);
    setCopied(false);
    const fileInput = document.getElementById("file-input-tool") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, [preview]);

  return (
    <div className="space-y-8">
      {/* 标题和描述 - 参考 circlecropimage.com */}
      {showHeading && (
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("hero.title1")} <span className="text-brand-teal">{t("hero.title2")}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            {t("hero.subtitle")}
          </p>
        </div>
      )}

      {/* 主要工具区域 */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <input
            id="file-input-tool"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={onFileChange}
          />

          {status === "success" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <LinkIcon className="h-5 w-5 text-brand-teal" />
                  {t("result.generated")}
                </div>
                <a
                  href={url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!url) e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4",
                    url ? "text-brand-teal hover:opacity-80" : "text-slate-400 cursor-not-allowed"
                  )}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  {t("result.open")}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                  title={url ?? t("result.placeholder")}
                >
                  {url ?? t("result.placeholder")}
                </div>
                <Button
                  onClick={(e) => void copyUrl(e)}
                  disabled={!url}
                  variant={undefined}
                  className={cn(
                    "h-10 rounded-lg px-4 text-sm font-semibold transition-all whitespace-nowrap shrink-0",
                    !url
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-brand-teal text-white hover:bg-brand-teal hover:scale-105 hover:shadow-lg"
                  )}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? t("result.copied") : t("result.copy")}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="hidden sm:inline-flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">
                  💡 {t("result.saveHint")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className="h-9 rounded-lg border px-3 text-xs font-semibold transition sm:px-4 sm:text-sm"
                  onClick={saveUrlAsTxt}
                >
                  <FileText className="mr-1.5 h-4 w-4" />
                  .txt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className="h-9 rounded-lg border px-3 text-xs font-semibold transition sm:px-4 sm:text-sm"
                  onClick={saveUrlAsJson}
                >
                  <FileJson className="mr-1.5 h-4 w-4" />
                  .json
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className="h-9 rounded-lg border px-3 text-xs font-semibold transition sm:px-4 sm:text-sm"
                  onClick={saveUrlAsMd}
                >
                  <FileCode2 className="mr-1.5 h-4 w-4" />
                  .md
                </Button>
              </div>

              {preview && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {fileName}
                    </div>
                    <LocaleLink
                      href="/circlecrop"
                      className="inline-flex items-center gap-1.5 text-sm text-brand-teal hover:underline transition-colors"
                      onClick={(e) => {
                        if (originalFile) {
                          // 将文件转换为 base64 并保存到 sessionStorage
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            sessionStorage.setItem('circleCropImage', base64);
                            sessionStorage.setItem('circleCropFileName', originalFile.name);
                            sessionStorage.setItem('circleCropFileType', originalFile.type);
                          };
                          reader.readAsDataURL(originalFile);
                        }
                      }}
                    >
                      👉 {t("result.tryCircleCrop")}
                    </LocaleLink>
                  </div>
                  <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100 sm:h-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt={fileName ?? tImages("previewAlt")}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={clearUpload}
                >
                  <X className="h-4 w-4 mr-1.5" />
                  {t("upload.clear")}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "relative rounded-2xl border-2 border-dashed p-12 text-center transition-colors sm:p-16 min-h-[320px] sm:min-h-[360px] flex flex-col items-center justify-center",
                "cursor-pointer hover:bg-teal-50/30",
                isDragging || animatingSample ? "bg-teal-50/50 border-brand-teal" : "bg-white border-slate-200"
              )}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onPaste={onPaste}
              onClick={() => document.getElementById("file-input-tool")?.click()}
              role="button"
              tabIndex={0}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-brand-teal relative overflow-hidden">
                {animatingSample ? (
                  <motion.img
                    key={animatingSample.key}
                    src={animatingSample.src}
                    alt={tImages("animatingSampleAlt")}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    initial={{ scale: 0.3, opacity: 0, x: 200, y: 200 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ) : (
                  <Upload className="h-7 w-7 relative z-10" />
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  size="lg"
                  className="ez-btn-gradient h-11 rounded-full px-7 text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("file-input-tool")?.click();
                  }}
                >
                  {t("hero.upload")}
                </Button>
                <p className="text-sm text-slate-500">{t("upload.orDrop")}</p>
              </div>
            </div>
          )}

          <p className="mt-3 text-center text-xs text-slate-500 sm:text-sm">{t("upload.hint")}</p>

          {/* 示例图片 */}
          {status !== "success" && (
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-slate-700">{t("upload.samplesTitle")}</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                {SAMPLE_IMAGES.map((item) => (
                  <motion.img
                    key={item.key}
                    src={item.src}
                    alt={tImages("sampleThumbAlt")}
                    className="h-14 w-14 cursor-pointer object-cover rounded-lg"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      void uploadSample(item.src, item.key);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        void uploadSample(item.src, item.key);
                      }
                    }}
                    aria-label={tImages("useSampleAria")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 额外内容 - 使用说明、使用场景等 */}
      {showExtraContent && (
        <div className="mx-auto max-w-4xl space-y-12">
          {/* 使用说明 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">{t("how.title")}</h2>
            <ol className="space-y-3 text-sm text-slate-600 leading-relaxed sm:text-base list-decimal list-inside">
              <li>{t("how.step1")}</li>
              <li>{t("how.step2")}</li>
              <li>{t("how.step3")}</li>
            </ol>
            <p className="text-sm text-slate-500 sm:text-base">{t("how.note")}</p>
          </div>

          {/* 使用场景 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Popular Ways to Use Photo To URL</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Social Media", desc: "Share images on Twitter, Facebook, Instagram, and other platforms with clean, direct links." },
                { title: "Documentation", desc: "Embed photos in Markdown docs, wikis, and CMS editors with predictable URLs." },
                { title: "Support Tickets", desc: "Attach screenshots in tickets, chat threads, or runbooks without bulky attachments." },
                { title: "Blog Posts", desc: "Use direct image links in blog posts and articles for faster loading." },
                { title: "Team Collaboration", desc: "Share product screenshots and design mocks in Slack, Discord, or Teams." },
                { title: "Email & Messaging", desc: "Send proof-of-concept captures or customer walkthroughs via email or messaging." },
              ].map((item) => (
                <div key={item.title} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 功能特点 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">{t("features.title")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: t("features.items.cdn.title"), desc: t("features.items.cdn.desc") },
                { title: t("features.items.save.title"), desc: t("features.items.save.desc") },
                { title: t("features.items.clipboard.title"), desc: t("features.items.clipboard.desc") },
                { title: t("features.items.errors.title"), desc: t("features.items.errors.desc") },
                { title: t("features.items.nosignup.title"), desc: t("features.items.nosignup.desc") },
                { title: t("features.items.r2.title"), desc: t("features.items.r2.desc") },
              ].map((item) => (
                <div key={item.title} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-base font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">{t("longform.faq.title")}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {[
                { q: t("longform.faq.items.1.q"), a: t("longform.faq.items.1.a") },
                { q: t("longform.faq.items.2.q"), a: t("longform.faq.items.2.a") },
                { q: t("longform.faq.items.3.q"), a: t("longform.faq.items.3.a") },
                { q: t("longform.faq.items.4.q"), a: t("longform.faq.items.4.a") },
                { q: t("longform.faq.items.5.q"), a: t("longform.faq.items.5.a") },
              ].map((item, index) => (
                <div key={index} className="border-t border-slate-200 pt-4">
                  <p className="font-semibold text-slate-900 mb-1">{item.q}</p>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

