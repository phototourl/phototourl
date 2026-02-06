"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import logoShowcase from "../../../public/projects/light-bg-logo.png";
import {
  Upload,
  Link as LinkIcon,
  Loader2,
  Image as ImageIcon,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  Copy,
  FileText,
  ArrowUpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { useLocaleRouter, LocaleLink } from "@/i18n/navigation";
import { Star, Check } from "lucide-react";
import { ScrollButtons } from "@/components/ScrollButtons";
import { addUploadRecord } from "@/lib/upload-history";

// 延迟加载演示组件以提升首屏性能
const HeroLeftFlowDemo = dynamic(() => import("@/components/HeroLeftFlowDemo"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-xl">
      <div className="relative h-[400px] sm:h-[450px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  ),
});

type UploadState = "idle" | "uploading" | "success" | "error";

// 参考你 PhotoToUrlLandingPage.jsx 里的老照片示例（演示用，三张照片轮播）
const OLD_PHOTO_URLS = [
  "/projects/demo1.jpeg",
  "/projects/demo2.jpg",
  "/projects/demo3.jpg",
];

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tImages = useTranslations("images");
  const router = useLocaleRouter();
  const isRTL = locale === "ar";

  const [status, setStatus] = useState<UploadState>("idle");
  const [_error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [animatingSample, setAnimatingSample] = useState<{ src: string; key: string } | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  // 组件挂载时：从 sessionStorage 恢复图片状态（切换语言后）
  useEffect(() => {
    // 检查是否是语言切换
    const isLanguageSwitch = sessionStorage.getItem('homePageLanguageSwitch') === 'true';
    
    // 如果不是语言切换，清空缓存
    if (!isLanguageSwitch) {
      sessionStorage.removeItem('homePageStatus');
      sessionStorage.removeItem('homePageUrl');
      sessionStorage.removeItem('homePageFileName');
      sessionStorage.removeItem('homePagePreview');
      sessionStorage.removeItem('homePageImageBase64');
      sessionStorage.removeItem('homePageFileType');
      return;
    }
    
    // 清除语言切换标记
    sessionStorage.removeItem('homePageLanguageSwitch');
    
    const savedStatus = sessionStorage.getItem('homePageStatus');
    const savedUrl = sessionStorage.getItem('homePageUrl');
    const savedFileName = sessionStorage.getItem('homePageFileName');
    const savedPreview = sessionStorage.getItem('homePagePreview');
    const savedImageBase64 = sessionStorage.getItem('homePageImageBase64');
    const savedFileType = sessionStorage.getItem('homePageFileType');
    const savedFileSize = sessionStorage.getItem('homePageFileSize');

    if (savedStatus === 'success' && savedUrl && savedFileName && savedImageBase64 && savedFileType) {
      // 恢复文件对象
      const base64Data = savedImageBase64.includes(',') ? savedImageBase64.split(',')[1] : savedImageBase64;
      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: savedFileType });
      const file = new File([blob], savedFileName, { type: savedFileType });
      
      // 验证文件大小是否匹配（确保是同一张图片）
      if (savedFileSize && file.size.toString() !== savedFileSize) {
        // 文件大小不匹配，可能是旧缓存，清空并返回
        sessionStorage.removeItem('homePageStatus');
        sessionStorage.removeItem('homePageUrl');
        sessionStorage.removeItem('homePageFileName');
        sessionStorage.removeItem('homePagePreview');
        sessionStorage.removeItem('homePageImageBase64');
        sessionStorage.removeItem('homePageFileType');
        sessionStorage.removeItem('homePageFileSize');
        sessionStorage.removeItem('homePageTimestamp');
        return;
      }
      
      // 恢复状态
      setStatus('success');
      setUrl(savedUrl);
      setFileName(savedFileName);
      setPreview(savedPreview);
      setOriginalFile(file);
    }
  }, []);

  // 当状态变化时，保存到 sessionStorage（用于切换语言时恢复）
  // 使用 URL 作为唯一标识符，确保缓存的是最新上传的图片
  useEffect(() => {
    if (status === 'success' && url && fileName && originalFile) {
      // 将文件转换为 base64 保存
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // 使用 URL 作为唯一标识符，确保是同一张图片
        sessionStorage.setItem('homePageStatus', status);
        sessionStorage.setItem('homePageUrl', url); // URL 是唯一的，每次上传都会生成新的
        sessionStorage.setItem('homePageFileName', fileName);
        sessionStorage.setItem('homePagePreview', preview || '');
        sessionStorage.setItem('homePageImageBase64', base64);
        sessionStorage.setItem('homePageFileType', originalFile.type);
        sessionStorage.setItem('homePageFileSize', originalFile.size.toString()); // 添加文件大小作为验证
        sessionStorage.setItem('homePageTimestamp', Date.now().toString()); // 添加时间戳
      };
      reader.readAsDataURL(originalFile);
    } else if (status === 'idle') {
      // 清空缓存
      sessionStorage.removeItem('homePageStatus');
      sessionStorage.removeItem('homePageUrl');
      sessionStorage.removeItem('homePageFileName');
      sessionStorage.removeItem('homePagePreview');
      sessionStorage.removeItem('homePageImageBase64');
      sessionStorage.removeItem('homePageFileType');
      sessionStorage.removeItem('homePageFileSize');
      sessionStorage.removeItem('homePageTimestamp');
    }
  }, [status, url, fileName, preview, originalFile]);



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
        const message =
          res.status === 429 ? t("result.dailyLimitReached") : data?.error || t("result.error");
        throw new Error(message);
      }

      setStatus("success");
      setUrl(data.url);
      setPreview(URL.createObjectURL(file));
      addUploadRecord({ url: data.url, fileName: file.name, timestamp: Date.now() });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("result.error"));
    }
  }, [t]);

  const uploadSample = useCallback(
    async (src: string, fileNameForUi: string) => {
      // 触发动画
      setAnimatingSample({ src, key: fileNameForUi });
      setStatus("uploading");
      
      // 等待动画完成（约 1 秒）
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
    // 只有当离开整个上传区域时才取消拖拽状态
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

  const _saveUrlAsJson = (e?: React.MouseEvent) => {
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

  const _saveUrlAsCsv = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    const content = `link\n"${url.replace(/"/g, '""')}"\n`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phototourl-link.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const _saveUrlAsMd = (e?: React.MouseEvent) => {
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

  const _saveUrlAsHtml = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    const content = `<!doctype html><html><body><a href="${url}">${url}</a></body></html>`;
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phototourl-link.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const scrollToUpload = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const clearUpload = useCallback(() => {
    // 清理预览 URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    // 重置所有状态
    setStatus("idle");
    setError(null);
    setUrl(null);
    setFileName(null);
    setPreview(null);
    setCopied(false);
    // 清理文件输入框
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, [preview]);

  return (
    <div className="flex flex-col">
      {/* ezremove-like hero layout: 白底首屏（不使用渐变） + 左文案/演示 + 右上传卡片 */}
      <section className="bg-white relative" style={{ minHeight: '100vh' }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 pt-16 pb-10 sm:gap-10 sm:pt-20 sm:pb-14 lg:max-w-7xl lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-10 lg:pt-24 lg:pb-20">
          {/* Left */}
          <div className="space-y-5 lg:pr-6 text-slate-900 sm:space-y-6 flex flex-col lg:h-full">
            <div className="space-y-4">
              <h1
                className={cn(
                  "text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl",
                  !["ru", "uk", "vi", "pl", "tr", "fr", "fi"].includes(locale) && "whitespace-nowrap"
                )}
              >
                {isRTL ? (
                  <>
                    <span className="text-brand-teal">{t("hero.title2")}</span>{" "}
                    <span className="text-slate-900">{t("hero.title1")}</span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-900">{t("hero.title1")}</span>{" "}
                    <span className="text-brand-teal">{t("hero.title2")}</span>
                  </>
                )}
              </h1>
              <p className="text-sm leading-relaxed text-brand-teal sm:text-base whitespace-nowrap">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="pt-4 lg:flex-1 lg:flex lg:flex-col">
              {status === "success" ? (
                <div
                  className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
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
                      className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 text-opacity-90"
                      title={url ?? t("result.placeholder")}
                    >
                      {url ?? t("result.placeholder")}
                    </div>
                    <Button
                      onClick={(e) => void copyUrl(e)}
                      disabled={!url}
                      variant={undefined}
                      className={cn(
                        "h-9 rounded-lg px-3 text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-w-max sm:h-10 sm:px-4 sm:text-sm",
                        !url
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : "bg-brand-teal text-white hover:bg-brand-teal hover:scale-105 hover:shadow-lg"
                      )}
                    >
                      <Copy className="mr-1.5 h-4 w-4 sm:mr-2" />
                      {copied ? t("result.copied") : t("result.copy")}
                    </Button>
                  </div>
                  <div className="flex flex-nowrap items-center gap-2 text-sm text-slate-600">
                    <span className="hidden sm:inline-flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">
                      💡 {t("result.saveHint")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!url}
                      className={cn(
                        "h-9 rounded-lg border px-3 text-xs font-semibold transition sm:h-10 sm:px-4 sm:text-sm",
                        !url
                          ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                          : "border-slate-200 bg-white text-slate-800"
                      )}
                      onClick={saveUrlAsTxt}
                    >
                      <FileText className="mr-1.5 h-4 w-4 sm:mr-2" />
                      .txt
                    </Button>
                  </div>
                  {preview && (
                    <div className="mt-4">
                      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                        <ImageIcon className="h-4 w-4" />
                        {fileName}
                      </div>
                      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-transparent sm:h-56">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt={fileName ?? tImages("previewAlt")}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="lg:flex-1 lg:flex lg:items-start">
                  <HeroLeftFlowDemo oldPhotoUrls={OLD_PHOTO_URLS} />
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <section id="upload-card" className="flex justify-center lg:justify-end lg:h-full">
            <div
              className={cn(
                "ez-shadow-card group relative w-full max-w-xl rounded-3xl border border-slate-200 p-7 sm:p-8 lg:h-full lg:flex lg:flex-col"
              )}
              style={{ backgroundColor: 'transparent' }}
            >
              <input
                id="file-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                className="hidden"
                onChange={onFileChange}
              />

              <div
                className={cn(
                  "relative rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center transition-colors sm:p-16 min-h-[320px] sm:min-h-[360px] lg:flex-1",
                  "cursor-pointer hover:bg-teal-50/30",
                  isDragging || animatingSample ? "bg-teal-50/50" : "bg-white"
                )}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onPaste={onPaste}
                onClick={() => document.getElementById("file-input")?.click()}
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
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="lg"
                      className="ez-btn-gradient h-11 rounded-full px-7 text-sm font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("file-input")?.click();
                      }}
                      disabled={status === "uploading"}
                    >
                      {status === "uploading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("demo.processing")}
                        </>
                      ) : (
                        t("hero.upload")
                      )}
                    </Button>
                    {status === "success" && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-11 rounded-full px-4 text-sm font-semibold border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearUpload();
                        }}
                      >
                        <X className="h-4 w-4 mr-1.5" />
                        {t("upload.clear")}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{t("upload.orDrop")}</p>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-slate-500 sm:text-sm">{t("upload.hint")}</p>

              <div className="mt-6 text-center" style={{ backgroundColor: 'transparent' }}>
                <p className="text-sm font-medium text-slate-700">{t("upload.samplesTitle")}</p>
                <div className="mt-3 flex items-center justify-center gap-3" style={{ backgroundColor: 'transparent' }}>
                  {[
                    { src: "/projects/sample-1.png", key: "sample-1" },
                    { src: "/projects/sample-2.png", key: "sample-2" },
                    { src: "/projects/sample-3.png", key: "sample-3" },
                    { src: "/projects/sample-4.png", key: "sample-4" },
                  ].map((item) => (
                    <motion.img
                      key={item.key}
                      src={item.src}
                      alt={tImages("sampleThumbAlt")}
                      className="h-14 w-14 cursor-pointer object-cover block"
                      style={{ 
                        display: 'block',
                        background: 'transparent',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        outline: 'none',
                        borderRadius: '0.75rem'
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        void uploadSample(item.src, item.key);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          void uploadSample(item.src, item.key);
                        }
                      }}
                      aria-label={tImages("useSampleAria")}
                    />
                  ))}
                </div>
              </div>

          </div>
        </section>
        </div>
        
        {/* Circle Crop Guidance - Fixed at viewport bottom, aligned with scroll button (bottom-8 = 32px) - Only show after upload success */}
        {status === "success" && url && (
          <div className="fixed bottom-8 left-0 right-0 z-20 pointer-events-none">
            <div className="mx-auto max-w-6xl px-6 lg:px-10">
              <div className="text-center pointer-events-auto">
                <LocaleLink
                  href="/circle-crop"
                  className="inline-flex items-center gap-1.5 text-base sm:text-lg font-medium text-brand-teal transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    
                    // 优先使用 originalFile，如果没有则从 sessionStorage 恢复
                    let fileToUse = originalFile;
                    
                    if (!fileToUse) {
                      // 从 sessionStorage 恢复文件
                      const savedImageBase64 = sessionStorage.getItem('homePageImageBase64');
                      const savedFileName = sessionStorage.getItem('homePageFileName');
                      const savedFileType = sessionStorage.getItem('homePageFileType');
                      const savedFileSize = sessionStorage.getItem('homePageFileSize');
                      const savedUrl = sessionStorage.getItem('homePageUrl');
                      
                      // 验证：确保当前显示的 URL 和缓存的 URL 一致（确保是同一张图片）
                      if (savedImageBase64 && savedFileName && savedFileType && savedUrl && url && savedUrl === url) {
                        const base64Data = savedImageBase64.includes(',') ? savedImageBase64.split(',')[1] : savedImageBase64;
                        const byteString = atob(base64Data);
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) {
                          ia[i] = byteString.charCodeAt(i);
                        }
                        const blob = new Blob([ab], { type: savedFileType });
                        fileToUse = new File([blob], savedFileName, { type: savedFileType });
                        
                        // 验证文件大小是否匹配
                        if (savedFileSize && fileToUse.size.toString() !== savedFileSize) {
                          fileToUse = null; // 文件大小不匹配，不使用
                        }
                      }
                    }
                    
                    if (fileToUse) {
                      // 设置标记，表示这是从首页跳转过来的
                      sessionStorage.setItem('circleCropFromHome', 'true');
                      // 将文件转换为 base64 并保存到 sessionStorage
                      const file = fileToUse; // 保存引用，避免在异步回调中可能为 null
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        sessionStorage.setItem('circleCropImage', base64);
                        sessionStorage.setItem('circleCropFileName', file.name);
                        sessionStorage.setItem('circleCropFileType', file.type);
                        // 保存完成后再跳转
                        router.push('/circle-crop');
                      };
                      reader.readAsDataURL(file);
                    } else {
                      // 如果没有文件，直接跳转
                      router.push('/circle-crop');
                    }
                  }}
                >
                  <motion.span
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                    👉
                  </motion.span>
                  <span className="hover:underline">{t("result.tryPrefix")}{tCommon("header.circleCrop")}</span>
                </LocaleLink>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="section-bg-purple pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{t("benefits.title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">{t("benefits.subtitle")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
          {
            title: t("benefits.items.fast.title"),
            desc: t("benefits.items.fast.desc"),
            icon: Rocket,
                   accent: "border-slate-200 bg-white",
          },
          {
            title: t("benefits.items.direct.title"),
            desc: t("benefits.items.direct.desc"),
            icon: LinkIcon,
                   accent: "border-slate-200 bg-white",
          },
          {
            title: t("benefits.items.nosignup.title"),
            desc: t("benefits.items.nosignup.desc"),
            icon: ShieldCheck,
                   accent: "border-slate-200 bg-white",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="space-y-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-brand-teal">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-gradient-benefits py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{t("how.title")}</h2>
            </div>
            {/* How it works illustration directly under the title */}
            <div className="mx-auto mt-6 flex justify-center">
              <Image
                src="/og-image.png"
                alt={tImages("howIllustrationAlt")}
                width={600}
                height={450}
                className="h-auto w-[26rem] md:w-[32rem] rounded-3xl shadow-xl"
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 mx-auto">
                  <ol className="space-y-4 text-sm text-slate-600 leading-relaxed">
                    <li>{t("how.step1")}</li>
                    <li>{t("how.step2")}</li>
                    <li>{t("how.step3")}</li>
                  </ol>
                  <p className="text-sm text-slate-500">
                    {t("how.note")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-bg-yellow py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{t("process.title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">{t("process.subtitle")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
          {[
            { num: "1", title: t("process.steps.1.title"), desc: t("process.steps.1.desc") },
            { num: "2", title: t("process.steps.2.title"), desc: t("process.steps.2.desc") },
            { num: "3", title: t("process.steps.3.title"), desc: t("process.steps.3.desc") },
          ].map((step) => (
            <div
              key={step.num}
              className="space-y-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal text-sm font-semibold text-white">
                  {step.num}
                </span>
                <p className="text-lg font-semibold text-slate-800">{step.title}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
            </div>
          ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{t("features.title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">{t("features.subtitle")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: t("features.items.cdn.title"), desc: t("features.items.cdn.desc") },
            { title: t("features.items.save.title"), desc: t("features.items.save.desc") },
            { title: t("features.items.clipboard.title"), desc: t("features.items.clipboard.desc") },
            { title: t("features.items.errors.title"), desc: t("features.items.errors.desc") },
            { title: t("features.items.nosignup.title"), desc: t("features.items.nosignup.desc") },
            { title: t("features.items.r2.title"), desc: t("features.items.r2.desc") },
          ].map((item) => (
            <div key={item.title} className="space-y-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-base font-semibold text-slate-800">{item.title}</p>
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-bg-purple pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{t("testimonials.title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">{t("testimonials.subtitle")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: t("testimonials.items.ops.name"),
              quote: t("testimonials.items.ops.quote"),
            },
            {
              name: t("testimonials.items.content.name"),
              quote: t("testimonials.items.content.quote"),
            },
            {
              name: t("testimonials.items.support.name"),
              quote: t("testimonials.items.support.quote"),
            },
          ].map((t) => (
            <div key={t.name} className="space-y-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-slate-600 leading-relaxed">"{t.quote}"</p>
              <p className="text-sm font-semibold text-slate-800">{t.name}</p>
            </div>
          ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-bg-yellow py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="flex items-center gap-5 sm:gap-6">
            <Image
              src={logoShowcase}
              alt="Photo To URL logo"
              width={260}
              height={260}
              className="h-auto w-48 md:w-52 flex-shrink-0"
            />
            <div className="text-center space-y-5 flex-1 min-w-0">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{t("cta.title")}</h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {t("cta.subtitle")}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="ez-btn-gradient h-12 rounded-full px-7 text-base font-semibold"
                  onClick={scrollToUpload}
                >
                  <ArrowUpCircle className="mr-2 h-5 w-5" />
                  {t("cta.upload")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-slate-300 bg-white px-7 text-base font-semibold text-slate-900 transition"
                  onClick={scrollToUpload}
                >
                  <ArrowUpCircle className="mr-2 h-5 w-5 text-brand-teal" />
                  {t("cta.paste")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Select Region */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-10">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">{t("selectRegion.title")}</h3>
              <p className="text-sm text-slate-600">{t("selectRegion.subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { code: "en", label: "English", countryCode: "US" },
                { code: "de", label: "Deutsch (German)", countryCode: "DE" },
                { code: "rm", label: "Rumantsch (Romansh)", countryCode: "CH" },
                { code: "es", label: "Español (Spanish)", countryCode: "ES" },
                { code: "fr", label: "Français (French)", countryCode: "FR" },
                { code: "ar", label: "العربية (Arabic)", countryCode: "SA" },
                { code: "pt", label: "Português (Portuguese)", countryCode: "PT" },
                { code: "jp", label: "日本語 (Japanese)", countryCode: "JP" },
                { code: "zh", label: "简体中文 (Simplified Chinese)", countryCode: "CN" },
                { code: "ko", label: "한국어 (Korean)", countryCode: "KR" },
                { code: "it", label: "Italiano (Italian)", countryCode: "IT" },
                { code: "zh-TW", label: "繁體中文 (Traditional Chinese)", countryCode: "TW" },
                { code: "tr", label: "Türkçe (Turkish)", countryCode: "TR" },
                { code: "nl", label: "Nederlands (Dutch)", countryCode: "NL" },
                { code: "pl", label: "Polski (Polish)", countryCode: "PL" },
                { code: "vi", label: "Tiếng Việt (Vietnamese)", countryCode: "VN" },
                { code: "th", label: "ไทย (Thai)", countryCode: "TH" },
                { code: "cs", label: "Čeština (Czech)", countryCode: "CZ" },
                { code: "sv", label: "Svenska (Swedish)", countryCode: "SE" },
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
                { code: "tl", label: "Tagalog", countryCode: "PH" },
              ].map((item) => {
                const isSelected = locale === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      // 设置标记以保留图片状态
                      sessionStorage.setItem('homePageLanguageSwitch', 'true');
                      router.replace("/", { locale: item.code });
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-left text-xs sm:text-sm font-medium transition-all",
                      "hover:shadow-md hover:-translate-y-0.5",
                      isSelected
                        ? "border-brand-teal bg-brand-teal/10 text-brand-teal shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-teal/50 hover:bg-slate-50"
                    )}
                  >
                    <img
                      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${item.countryCode.toLowerCase()}.svg`}
                      alt={item.label}
                      title={item.label}
                      aria-label={item.label}
                      style={{ width: "1.2em", height: "1.2em", display: "inline-block" }}
                      className="shrink-0"
                    />
                    <span className="flex-1 text-xs sm:text-sm break-words">{item.label.split(" (")[0]}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-brand-teal" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Rate Service - Standalone */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-800">{t("rateService.title")}</h3>
            
            {/* Thank You Message */}
            {showThankYou && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2 text-green-600 font-medium"
              >
                <Check className="h-5 w-5" />
                <span>{t("rateService.thankYou")}</span>
              </motion.div>
            )}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const displayRating = hoveredStar || selectedRating;
                const filledStars = displayRating ? Math.floor(displayRating) : 0;
                
                return (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => {
                      setSelectedRating(star);
                      setShowThankYou(true);
                      // 模拟提交评分（实际应用中会调用API）
                      setTimeout(() => {
                        setSelectedRating(null);
                        setShowThankYou(false);
                      }, 4000);
                    }}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        displayRating && star <= filledStars
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-slate-300"
                      )}
                      strokeWidth={displayRating && star <= filledStars ? 0 : 1.5}
                    />
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="text-3xl font-bold text-slate-800">
                <span className="font-extrabold">{t("rateService.averageRating")}</span>
              </div>
              <div className="text-sm text-slate-500 mt-2">{t("rateService.votes")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Long-form SEO & education */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t("longform.title")}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {t("longform.p1")}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {t("longform.p2")}
            </p>
          </div>

          <div className="mt-10 space-y-10">
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-900">{t("longform.useCases.title")}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                <li>{t("longform.useCases.items.1")}</li>
                <li>{t("longform.useCases.items.2")}</li>
                <li>{t("longform.useCases.items.3")}</li>
                <li>{t("longform.useCases.items.4")}</li>
                <li>{t("longform.useCases.items.5")}</li>
                <li>{t("longform.useCases.items.6")}</li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-900">{t("longform.flow.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t("longform.flow.p1")}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t("longform.flow.p2")}</p>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-900">{t("longform.best.title")}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                <li>{t("longform.best.items.1")}</li>
                <li>{t("longform.best.items.2")}</li>
                <li>{t("longform.best.items.3")}</li>
                <li>{t("longform.best.items.4")}</li>
                <li>{t("longform.best.items.5")}</li>
                <li>{t("longform.best.items.6")}</li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-900">{t("longform.roadmap.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t("longform.roadmap.p1")}</p>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-900">{t("longform.faq.title")}</h3>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                <div>
                  <p className="font-semibold text-slate-900">{t("longform.faq.items.1.q")}</p>
                  <p className="mt-1 text-slate-600">{t("longform.faq.items.1.a")}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t("longform.faq.items.2.q")}</p>
                  <p className="mt-1 text-slate-600">{t("longform.faq.items.2.a")}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t("longform.faq.items.3.q")}</p>
                  <p className="mt-1 text-slate-600">{t("longform.faq.items.3.a")}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t("longform.faq.items.4.q")}</p>
                  <p className="mt-1 text-slate-600">{t("longform.faq.items.4.a")}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t("longform.faq.items.5.q")}</p>
                  <p className="mt-1 text-slate-600">{t("longform.faq.items.5.a")}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-900">{t("longform.keywords.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t("longform.keywords.p1")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}
