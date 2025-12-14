"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type DemoStep = "idle" | "processing" | "done";

type HeroWorkflowDemoProps = {
  /** 传入一张“老照片/示例照片”，用于演示流程 */
  imageSrc: string;
  imageAlt?: string;
  /** 右上角文件标签（例如 JPG/PNG/OLD） */
  fileTag?: string;
  /** 演示用的最终链接（仅展示/复制，不影响真实上传） */
  demoUrl?: string;
};

export default function HeroWorkflowDemo({
  imageSrc,
  imageAlt = "Demo photo",
  fileTag = "JPG",
  demoUrl: demoUrlProp,
}: HeroWorkflowDemoProps) {
  const t = useTranslations("home");

  const [step, setStep] = useState<DemoStep>("idle");
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);

  const demoUrl = useMemo(
    () => demoUrlProp ?? "cdn.phototourl.com/u/old-photo",
    [demoUrlProp]
  );

  // Auto-loop the demo: idle -> processing -> done -> idle
  useEffect(() => {
    let toProcessing: number | undefined;
    let toDone: number | undefined;
    let toIdle: number | undefined;

    if (step === "idle") {
      toProcessing = window.setTimeout(() => setStep("processing"), 1500);
    } else if (step === "processing") {
      toDone = window.setTimeout(() => setStep("done"), 1800);
    } else if (step === "done") {
      toIdle = window.setTimeout(() => setStep("idle"), 2800);
    }

    return () => {
      if (toProcessing) window.clearTimeout(toProcessing);
      if (toDone) window.clearTimeout(toDone);
      if (toIdle) window.clearTimeout(toIdle);
    };
  }, [step]);

  // Typewriter URL when done
  useEffect(() => {
    if (step !== "done") {
      setTyped("");
      return;
    }

    let i = 0;
    const full = `https://${demoUrl}`;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 22);

    return () => window.clearInterval(id);
  }, [demoUrl, step]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${demoUrl}`);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-xl">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
            {t("demo.label")}
          </div>
          <div className="text-xs text-slate-500">{t("demo.loop")}</div>
        </div>

        <div className="relative h-[260px] px-5 pb-5 pt-4 sm:h-[300px]">
          {/* Idle */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-all duration-500",
              step === "idle" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
          >
            <div className="relative mb-5">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* 演示图支持外链（避免 next/image 域名配置阻塞） */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
              </div>
              <div className="absolute -right-2 -top-2 rounded-full bg-brand-teal px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                {fileTag}
              </div>
            </div>
            <div className="text-lg font-semibold text-slate-900">{t("demo.idleTitle")}</div>
            <div className="mt-2 max-w-sm text-sm text-slate-600">{t("demo.idleSubtitle")}</div>
          </div>

          {/* Processing */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-all duration-500",
              step === "processing" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-brand-teal">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <div className="text-sm font-medium text-slate-700">{t("demo.processing")}</div>
            <div className="mt-4 flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-teal [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-teal [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-teal" />
            </div>
          </div>

          {/* Done */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-all duration-500",
              step === "done" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 ring-4 ring-teal-50/70">
              <Check className="h-7 w-7 text-brand-teal" strokeWidth={3} />
            </div>
            <div className="text-lg font-semibold text-slate-900">{t("demo.doneTitle")}</div>
            <div className="mt-2 max-w-sm text-sm text-slate-600">{t("demo.doneSubtitle")}</div>

            <div className="mt-5 w-full max-w-md rounded-2xl bg-slate-900 p-1 shadow-sm">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/50 p-3">
                <div className="flex min-w-0 items-center gap-2 text-left">
                  <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0 truncate font-mono text-xs text-slate-200">{typed}</div>
                </div>
                <Button
                  size="sm"
                  className="h-9 shrink-0 rounded-xl bg-brand-teal px-3 text-xs font-semibold text-white hover:opacity-90"
                  onClick={onCopy}
                >
                  <Copy className="mr-1.5 h-4 w-4" />
                  {copied ? t("result.copied") : t("result.copy")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


