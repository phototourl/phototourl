"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Upload,
  Link as LinkIcon,
  Check,
  Loader2,
  Image as ImageIcon,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  Copy,
  FileText,
  FileJson,
  Table,
  FileCode2,
  MousePointerClick,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function HomePage() {
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleUpload(file);
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

  const saveUrlAsCsv = (e?: React.MouseEvent) => {
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

  const saveUrlAsHtml = (e?: React.MouseEvent) => {
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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:max-w-7xl lg:px-10 lg:py-18">
      {/* Hero */}
      <section className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-5 max-w-4xl">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-sm">
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Free
            </span>
            <span className="text-blue-200">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              CDN links
            </span>
            <span className="text-blue-200">•</span>
            <span className="flex items-center gap-1">
              <Rocket className="h-3.5 w-3.5" />
              No signup
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Turn your photos into clean, shareable links in seconds
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 leading-relaxed">
            Upload once, paste everywhere. A simple way to host photos for blogs, docs, chat apps, and quick prototypes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 px-7 text-base font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload image
            </Button>
          </div>
          <ul className="mt-4 flex flex-wrap justify-center gap-5 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Fast sharing
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Direct photo links
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              No signup required
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Paste from clipboard
            </li>
          </ul>
        </div>

        {/* Upload card */}
      </section>

      {/* Upload card (centered) */}
      <section className="flex justify-center">
        <div
          className={cn(
            "group relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl transition",
            "hover:shadow-2xl focus-within:ring-2 focus-within:ring-blue-500",
            "before:pointer-events-none before:absolute before:inset-px before:rounded-[22px] before:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.07),transparent_30%)] before:opacity-80"
          )}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onPaste={onPaste}
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={onFileChange}
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {status === "uploading" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">Drop a photo or click to browse</p>
              <p className="text-sm text-slate-500">
                JPG, PNG, WEBP, GIF up to 10MB. Drag & drop, click, or paste screenshots.
              </p>
            </div>
          </div>

          {/* Result */}
          <div className="mt-8 space-y-4">
            {status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error ?? "Upload failed. Please try again."}
              </div>
            )}
            <div
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                  Generated link:
                </div>
                <a
                  href={url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!url) {
                      e.preventDefault();
                    }
                    e.stopPropagation();
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4",
                    url ? "text-blue-600 hover:text-blue-700" : "text-slate-400 cursor-not-allowed"
                  )}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Open in new tab
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 text-opacity-90"
                  title={url ?? "No link yet. Upload a photo to generate a shareable URL."}
                >
                  {url ?? "No link yet. Upload a photo to generate a shareable URL."}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">
                  Save link as you like
                  <MousePointerClick className="h-4 w-4 text-blue-500 rotate-90" />
                </span>
          <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className={cn(
                    "h-10 rounded-lg border px-4 text-sm font-semibold shadow-sm transition",
                    !url
                      ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                      : "border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-100 text-slate-800 hover:from-sky-100 hover:to-sky-200"
                  )}
                  onClick={saveUrlAsTxt}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  .txt
          </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className={cn(
                    "h-10 rounded-lg border px-4 text-sm font-semibold shadow-sm transition",
                    !url
                      ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                      : "border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-100 text-slate-800 hover:from-emerald-100 hover:to-emerald-200"
                  )}
                  onClick={(e) => saveUrlAsJson(e)}
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  .json
          </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className={cn(
                    "h-10 rounded-lg border px-4 text-sm font-semibold shadow-sm transition",
                    !url
                      ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                      : "border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-100 text-slate-800 hover:from-amber-100 hover:to-amber-200"
                  )}
                  onClick={(e) => saveUrlAsCsv(e)}
                >
                  <Table className="mr-2 h-4 w-4" />
                  .csv
          </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className={cn(
                    "h-10 rounded-lg border px-4 text-sm font-semibold shadow-sm transition",
                    !url
                      ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                      : "border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-100 text-slate-800 hover:from-indigo-100 hover:to-indigo-200"
                  )}
                  onClick={(e) => saveUrlAsMd(e)}
                >
                  <FileCode2 className="mr-2 h-4 w-4" />
                  .md
          </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!url}
                  className={cn(
                    "h-10 rounded-lg border px-4 text-sm font-semibold shadow-sm transition",
                    !url
                      ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                      : "border-rose-200 bg-gradient-to-r from-rose-50 via-white to-rose-100 text-slate-800 hover:from-rose-100 hover:to-rose-200"
                  )}
                  onClick={(e) => saveUrlAsHtml(e)}
                >
                  <Globe2 className="mr-2 h-4 w-4" />
                  .html
          </Button>
                <Button
                  onClick={(e) => void copyUrl(e)}
                  disabled={!url}
                  className={cn(
                    "h-10 rounded-lg px-4 text-sm font-semibold shadow-sm transition transform",
                    !url
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : copied
                        ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md hover:-translate-y-px"
                        : "bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md hover:-translate-y-px"
                  )}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied" : "Copy link"}
          </Button>
              </div>
            </div>
            {preview && (
              <div
                className="rounded-xl border border-slate-200 bg-white p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                  <ImageIcon className="h-4 w-4" />
                  {fileName}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="max-h-80 w-full rounded-md object-contain border border-slate-100 bg-slate-50"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Fast sharing",
            desc: "Upload and get a link in seconds with no extra steps.",
            icon: Rocket,
            accent: "from-blue-50 to-blue-100 border-blue-100",
          },
          {
            title: "Direct image URLs",
            desc: "Clean links that work in HTML, Markdown, and chat apps.",
            icon: LinkIcon,
            accent: "from-indigo-50 to-indigo-100 border-indigo-100",
          },
          {
            title: "No signup required",
            desc: "Use it right away. Accounts can come later as we grow.",
            icon: ShieldCheck,
            accent: "from-emerald-50 to-emerald-100 border-emerald-100",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={cn(
                "space-y-3 rounded-xl border bg-gradient-to-br p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg",
                item.accent
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-blue-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </section>

      {/* How it works */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <ol className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <li>1) Upload or paste an image (PNG/JPG/WEBP/GIF, up to 10MB).</li>
          <li>2) We store it locally for now and give you a direct URL.</li>
          <li>3) Copy the link and use it anywhere on the web.</li>
        </ol>
        <p className="text-sm text-slate-500">
          Note: Storage is local in this version. We plan to add cloud storage/CDN later.
        </p>
      </section>
    </div>
  );
}
