"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import logoShowcase from "@/image/logo.png";
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
  ArrowUpCircle,
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

  const scrollToUpload = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:max-w-7xl lg:px-10 lg:py-18">
      {/* Hero */}
      <section className="flex flex-col items-center gap-4 text-center -mt-4 sm:-mt-6">
        <div className="w-full max-w-5xl">
          <div className="mb-1 flex justify-center -translate-y-1 sm:-translate-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-sm">
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
          </div>
          <div className="mx-auto max-w-4xl space-y-5">
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
        </div>

        {/* Upload card */}
      </section>

      {/* Upload card (centered) */}
      <section id="upload-card" className="flex justify-center">
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
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Why people choose Photo to URL</h2>
          <p className="text-sm text-slate-600">Speed, clean links, and no signup needed.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
            <ol className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <li>1) Add your photo (drag, paste, or click to pick a file).</li>
              <li>2) We turn it into a link on our CDN.</li>
              <li>3) Copy and share the link anywhere you work.</li>
            </ol>
            <p className="text-sm text-slate-500">
              Your link opens fast in docs, chats, and prototypes—plus you can download it in the format you like (.txt/.json/.csv/.md/.html).
            </p>
          </div>
          <div className="mx-auto mt-2 flex-shrink-0 md:mt-0">
            <Image
              src={logoShowcase}
              alt="Photo to URL logo"
              width={260}
              height={260}
              className="h-auto w-52 md:w-56"
              priority={false}
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Three-step flow</h2>
          <p className="text-sm text-slate-600">Reduce effort, keep the CTA visible, finish in seconds.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { num: "1", title: "Drop or paste", desc: "Drag a file, paste from clipboard, or browse." },
            { num: "2", title: "We host & return a link", desc: "Instant URL with copy/open/save controls." },
            { num: "3", title: "Share anywhere", desc: "Paste into docs, chats, tickets, blogs, or prototypes." },
          ].map((step) => (
            <div
              key={step.num}
              className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {step.num}
                </span>
                <p className="text-base font-semibold text-slate-900">{step.title}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Feature highlights</h2>
          <p className="text-sm text-slate-600">Clarity first: less friction, more sharing.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Direct CDN links", desc: "Clean, predictable URLs ready for Markdown and HTML embeds." },
            { title: "Copy & save actions", desc: "Copy, open, or save as .txt/.json/.csv/.md/.html with one click." },
            { title: "Clipboard friendly", desc: "Paste screenshots without hunting for files or re-uploads." },
            { title: "Friendly errors", desc: "Clear maintenance messages instead of technical stack traces." },
            { title: "No signup needed", desc: "Ship faster—upload and share immediately." },
            { title: "R2 ready", desc: "Designed to serve links via CDN when Cloudflare R2 is configured." },
          ].map((item) => (
            <div key={item.title} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-base font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Teams saving time with Photo to URL</h2>
          <p className="text-sm text-slate-600">Social proof to reduce risk and speed up adoption.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Product Ops",
              quote: "We paste screenshots into tickets without clogging attachments. Links stay clean.",
            },
            {
              name: "Content Lead",
              quote: "Markdown-ready links keep our docs tidy and publishable in minutes.",
            },
            {
              name: "Support",
              quote: "Clear errors and instant URLs make it easy to guide customers in chat.",
            },
          ].map((t) => (
            <div key={t.name} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-sm text-slate-500">“{t.quote}”</p>
              <p className="text-sm font-semibold text-slate-800">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="space-y-4 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-8 text-center shadow-md">
        <h2 className="text-2xl font-semibold text-slate-900">Turn photos into links in seconds</h2>
        <p className="text-sm text-slate-600">Drop, paste, or upload—copy your link and share everywhere.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="h-12 rounded-full bg-blue-600 px-7 text-base font-semibold text-white shadow-md transition hover:bg-blue-700"
            onClick={scrollToUpload}
          >
            <ArrowUpCircle className="mr-2 h-5 w-5 animate-bounce" />
            Upload now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-slate-300 px-7 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            onClick={scrollToUpload}
          >
            <ArrowUpCircle className="mr-2 h-5 w-5 animate-bounce text-blue-500" />
            Paste a screenshot
          </Button>
        </div>
      </section>

      {/* Long-form SEO & education */}
      <section className="space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-md">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Why Photo to URL helps your workflow</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Photo to URL Converter is built for creators, marketers, support teams, founders, and anyone who needs a quick, reliable way to turn photos into clean links. With a direct upload-to-link flow, you avoid heavy media managers and skip logins. Links are tidy, easy to paste into chat apps, docs, wikis, bug reports, and tickets. Teams move faster when screenshots and product photos are instantly shareable without attachment limits or messy previews. Because the links are predictable and consistent, they also work well in automation, QA steps, and lightweight prototypes.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The experience stays simple: drop, paste, or browse; get a link; share. No extra chrome, no distracting ads, no gating. You keep focus on your content while we handle the boring parts of hosting. Whether you are documenting a feature, preparing a blog post, building a pitch deck, or sending a quick support response, a short link beats bulky attachments. For global teams, the interface remains English-only, keeping copy concise and universal.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">Use cases that stay practical</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            <li>Product and design: share UI mocks, component screenshots, and quick visual notes without exporting to heavy tools.</li>
            <li>Support and QA: attach reproducible screenshots in tickets, chat threads, or runbooks; links stay tidy and easy to track.</li>
            <li>Docs and blogs: embed photos in Markdown, HTML, or CMS editors with predictable URLs and no layout surprises.</li>
            <li>Sales and CS: drop proof-of-concept captures or customer walkthroughs straight into email or messaging.</li>
            <li>Engineering handoff: keep build artifacts, error snaps, and regression visuals lightweight for faster reviews.</li>
            <li>Community and socials: paste links into Discord, Slack, Teams, Twitter/X, or forums without bloated previews.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">How the flow works end-to-end</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            1) Choose an image: drag-and-drop, paste from clipboard, or click to browse. PNG, JPG, WEBP, GIF up to 10MB are supported now. 2) We upload and return a direct link. The UI shows your URL immediately with copy, open, and multi-format save actions (.txt, .json, .csv, .md, .html). 3) You reuse the link anywhere: blogs, docs, tickets, chat, prototypes. The goal is a frictionless bridge between your photo and the places you work.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            Each step is tuned for clarity: visible status, friendly errors, and buttons that confirm actions. The copy button sits next to the link, and the save buttons let you keep the URL in your preferred format for bookmarking or automation. When R2 is enabled, links serve from the CDN domain; if the service is in maintenance, the UI returns a clear message instead of raw errors.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">Best practices for cleaner links</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            <li>Keep filenames meaningful before upload; they remain part of the URL and help future search.</li>
            <li>Use WEBP or optimized JPG/PNG for lighter payloads if you expect heavy sharing.</li>
            <li>Copy the link directly after generation to avoid stale clipboard entries.</li>
            <li>Save a .json or .csv when you need to batch store references for automation or audits.</li>
            <li>Use .md output when embedding in docs or wikis; it is ready to paste.</li>
            <li>For HTML embeds, pick the .html save to drop into simple demos or landing blocks.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">Roadmap highlights</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Upcoming improvements include deeper Cloudflare R2 integration by default, more generous upload limits, optional auth for team spaces, and per-link analytics. We also plan preset link styles, one-click delete, and organization-level buckets. SEO polish continues across blog, docs, and status pages, with richer schema and a public sitemap for fast indexing.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">FAQs</h3>
          <div className="space-y-2 text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800">Is it free?</p>
            <p>Yes, core upload-to-link is free. CDN-backed hosting via R2 will roll out with generous tiers.</p>
            <p className="font-semibold text-slate-800">What formats are supported?</p>
            <p>PNG, JPG, WEBP, GIF up to 10MB today. More formats can be added based on demand.</p>
            <p className="font-semibold text-slate-800">Can I embed in Markdown or HTML?</p>
            <p>Yes. Copy the link as-is, or use the one-click .md / .html saves for drop-in snippets.</p>
            <p className="font-semibold text-slate-800">Do you keep my files public?</p>
            <p>Links are shareable; when R2 CDN is enabled, they are served via the CDN domain. We show clear maintenance messages if storage is unavailable.</p>
            <p className="font-semibold text-slate-800">Will there be accounts or teams?</p>
            <p>Planned. We prioritize frictionless uploads first, then add team spaces, access control, and analytics.</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Keywords we care about</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            photo to url, image to url, photo hosting, shareable links, direct image link, free image hosting, cdn photo link, upload and copy link, paste image to link, instant photo link, blog image links, docs image links, chat image link, markdown image link, html image link, photo cdn, fast image sharing, no signup image host, simple photo hosting, quick image uploader, link generator for photos.
          </p>
        </div>
      </section>
    </div>
  );
}
