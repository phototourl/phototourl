"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import logoShowcase from "../../../public/projects/light1024logo.png";
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
  FileJson,
  FileCode2,
  MousePointerClick,
  ArrowUpCircle,
  ArrowUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";

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
  const isRTL = locale === "ar";

  const [status, setStatus] = useState<UploadState>("idle");
  const [_error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [animatingSample, setAnimatingSample] = useState<{ src: string; key: string } | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    const handleScroll = () => {
      // 检测是否滚动超过一屏高度（100vh）
      const scrollThreshold = window.innerHeight;
      setShowBackToTop(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setStatus("uploading");
    setError(null);
    setUrl(null);
    setFileName(file.name);

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

  const saveUrlAsMd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;
    const content = `[Photo to URL link](${url})\n`;
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
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 pt-16 pb-32 sm:gap-10 sm:pt-20 sm:pb-40 lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-10 lg:pt-24 lg:pb-48">
          {/* Left */}
          <div className="space-y-5 lg:pr-8 text-slate-900 sm:space-y-6 flex flex-col">
            <div className="space-y-4">
              <h1
                className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
                style={{ textWrap: "balance" } as CSSProperties}
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
              <p
                className="max-w-xl text-base leading-relaxed text-brand-teal sm:text-lg"
                style={{ textWrap: "balance" } as CSSProperties}
              >
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="pt-4">
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
                      className={cn(
                        "h-9 rounded-lg px-3 text-xs font-semibold transition transform whitespace-nowrap shrink-0 min-w-max sm:h-10 sm:px-4 sm:text-sm",
                        !url
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : copied
                            ? "bg-brand-teal text-white hover:opacity-90 hover:-translate-y-px"
                            : "bg-brand-teal text-white hover:opacity-90 hover:-translate-y-px"
                      )}
                    >
                      <Copy className="mr-1.5 h-4 w-4 sm:mr-2" />
                      {copied ? t("result.copied") : t("result.copy")}
                    </Button>
                  </div>
                  <div className="flex flex-nowrap items-center gap-2 text-sm text-slate-600">
                    <span className="hidden sm:inline-flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">
                      {t("result.savePrompt")}
                      <MousePointerClick className="h-4 w-4 text-brand-teal rotate-90" />
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
                      onClick={(e) => saveUrlAsJson(e)}
                    >
                      <FileJson className="mr-1.5 h-4 w-4 sm:mr-2" />
                      .json
                    </Button>
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
                      onClick={(e) => saveUrlAsMd(e)}
                    >
                      <FileCode2 className="mr-1.5 h-4 w-4 sm:mr-2" />
                      .md
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
                        <img src={preview} alt={fileName ?? "Preview"} className="h-full w-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <HeroLeftFlowDemo oldPhotoUrls={OLD_PHOTO_URLS} />
              )}
            </div>
          </div>

          {/* Right */}
          <section id="upload-card" className="flex justify-center lg:justify-end lg:self-start">
            <div
              className={cn(
                "ez-shadow-card group relative w-full max-w-xl rounded-3xl border border-slate-200 p-7 sm:p-8"
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
                  "relative rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center transition-colors sm:p-16 min-h-[320px] sm:min-h-[360px]",
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
                      alt="Animating sample"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                      initial={{ scale: 0.3, opacity: 0, x: 200, y: 200 }}
                      animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  ) : (
                    <>
                      {status === "uploading" ? <Loader2 className="h-6 w-6 animate-spin relative z-10" /> : <Upload className="h-7 w-7 relative z-10" />}
                    </>
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
                    >
                      {t("hero.upload")}
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
                      alt={`Sample image ${item.key}`}
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
                      aria-label={`Use sample ${item.key}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>

          </div>
        </section>
        </div>
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
                alt="Photo to URL preview graphic"
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
      <section className="section-bg-purple pt-0 pb-20 lg:pt-0 lg:pb-24">
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
              alt="Photo to URL logo"
              width={260}
              height={260}
              className="h-auto w-48 md:w-52 flex-shrink-0"
              priority
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

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToUpload}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
