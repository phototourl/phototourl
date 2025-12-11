"use client";

import { useCallback, useState } from "react";
import { Upload, Link as LinkIcon, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function HomePage() {
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10 lg:py-16">
      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800">
            Photo to URL Converter
          </span>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Turn your photos into clean, shareable links in seconds
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Upload once, paste everywhere. A simple way to host photos for blogs, docs, chat apps, and quick prototypes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload image
            </Button>
            {url ? (
              <Button variant="outline" size="lg" onClick={copyUrl}>
                <Check className="mr-2 h-4 w-4" />
                Copy link
              </Button>
            ) : null}
          </div>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
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
        <div
          className={cn(
            "group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition",
            "hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
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
                <p className="text-lg font-semibold text-slate-900">
                  Drop a photo or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                  JPG, PNG, WEBP, GIF up to 10MB. Drag & drop, click, or paste screenshots.
                  </p>
                </div>
              <Button variant="outline" className="mt-2">
                Choose file
              </Button>
          </div>

          {/* Result */}
          <div className="mt-6 space-y-3">
            {status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error ?? "Upload failed. Please try again."}
              </div>
            )}
            {url && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <LinkIcon className="h-4 w-4 text-blue-600" />
                  Generated link:
                </div>
                <div className="break-all rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                  {url}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={copyUrl}>
                    <Check className="mr-2 h-4 w-4" />
                    Copy link
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <a href={url} target="_blank" rel="noreferrer">
                      Open in new tab
                    </a>
                  </Button>
                </div>
              </div>
            )}
            {preview && (
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                  <ImageIcon className="h-4 w-4" />
                  {fileName}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="max-h-64 w-full rounded-md object-contain border border-slate-100 bg-slate-50"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Fast sharing",
            desc: "Upload and get a link in seconds with no extra steps.",
          },
          {
            title: "Direct image URLs",
            desc: "Clean links that work in HTML, Markdown, and chat apps.",
          },
          {
            title: "No signup required",
            desc: "Use it right away. Accounts can come later as we grow.",
          },
        ].map((item) => (
          <div key={item.title} className="space-y-2 rounded-xl bg-slate-50 p-4">
            <h3 className="text-base font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
        <ol className="space-y-3 text-sm text-slate-600">
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
