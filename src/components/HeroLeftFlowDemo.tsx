"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link as LinkIcon, Check, FileImage, Plus } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

// --- 静态配置（沿用你 PhotoToUrlLandingPage.jsx 的节奏） ---
const UPLOAD_DURATION = 2800;
// 用你站点的域名风格（不影响演示）
const SIMULATED_URL = "https://cdn.phototourl.com/u/creative-shot-2024.jpg";

type HeroLeftFlowDemoProps = {
  /** 老照片 URL 数组（演示用，轮播） */
  oldPhotoUrls: string[];
  /** 实际上传的结果 */
  actualResult?: {
    url: string;
    preview: string;
    fileName: string;
    copied: boolean;
    onCopy: () => void;
    onSaveTxt: () => void;
    onSaveJson: () => void;
    onSaveCsv: () => void;
    onSaveMd: () => void;
    onSaveHtml: () => void;
  };
};

// --- 组件：打字机效果 URL（按你原实现） ---
function TypewriterUrl({ text, textColor = "text-white", speed = 20, delay = 300 }: { text: string; textColor?: string; speed?: number; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    let timer: number | undefined;

    const startDelay = window.setTimeout(() => {
      timer = window.setInterval(() => {
        if (i < text.length) {
          // 每次直接截取前 i+1 个字符，避免多语言下字符被截断的问题
          setDisplayedText(text.slice(0, i + 1));
          i += 1;
        } else {
          if (timer) window.clearInterval(timer);
          setIsTyping(false);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(startDelay);
      if (timer) window.clearInterval(timer);
    };
  }, [text, speed, delay]);

  return (
    <span
      className={`font-bold whitespace-normal inline-block`}
      style={textColor ? {} : { color: "inherit" }}
    >
      {displayedText}
      {isTyping ? (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-0.5 h-5 sm:h-6 md:h-7 bg-current ml-1 align-middle"
        />
      ) : null}
    </span>
  );
}

// --- 自动演示覆盖层：老照片飞入（按你 photoAnimation 参数） ---
function AutoDemoOverlay({ step, oldPhotoUrl }: { step: string; oldPhotoUrl: string }) {
  const photoAnimation = {
    initial: { x: -240, y: -120, scale: 0.7, opacity: 1, rotate: -10 },
    animate: {
      x: 0,
      y: 12,
      scale: 1.1,
      opacity: 1,
      rotate: 5,
      transition: {
        x: { duration: 1.2, ease: "easeOut" },
        y: { duration: 1.2, ease: "easeOut" },
        scale: { duration: 1.2, ease: "easeOut" },
        opacity: { duration: 1.2, ease: "easeOut" },
        rotate: { duration: 1.2, ease: "easeOut" },
        delay: 0.5,
      },
    },
  } as const;

  const [imageError, setImageError] = useState(false);
  const tImages = useTranslations("images");

  if (step !== "idle") return null;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
      variants={photoAnimation}
      initial="initial"
      animate="animate"
    >
      <motion.div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
        {imageError ? (
          <div className="w-24 h-24 bg-gray-400 rounded-lg shadow-xl flex items-center justify-center text-white text-xs">
            [Image of Old Photo]
          </div>
        ) : (
          <Image
            src={oldPhotoUrl}
            alt={tImages("sampleThumbAlt")}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-lg shadow-2xl border-4 border-white ring-2 ring-gray-200"
            onError={() => setImageError(true)}
            loading="lazy"
            unoptimized
          />
        )}
      </motion.div>
    </motion.div>
  );
}

// --- 左侧主流程演示（按你 InteractiveDemo 结构） ---
export default function HeroLeftFlowDemo({ oldPhotoUrls }: HeroLeftFlowDemoProps) {
  const t = useTranslations("home.demo");
  const tImages = useTranslations("images");
  const locale = useLocale();
  const [step, setStep] = useState<"idle" | "processing" | "done" | "showLogo">("idle");

  // 结束文案打字速度：中文稍慢，其它语言更快一些
  const thanksTypingSpeed = locale === "zh" ? 180 : 90;
  const thanksTypingDelay = locale === "zh" ? 400 : 300;
  const [initialLoad, setInitialLoad] = useState(true);
  const [photoArrived, setPhotoArrived] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    let timer: number | undefined;

    const transitionTo = (nextStep: "idle" | "processing" | "done" | "showLogo", delay: number) => {
      timer = window.setTimeout(() => setStep(nextStep), delay);
    };

    if (step === "idle") {
      const delay = initialLoad ? 6000 : 4000;
      // 照片动画延迟 0.5 秒，持续时间 1.2 秒，所以照片在 1.7 秒后到达
      const photoArrivalTime = 500 + 1200;
      const photoTimer = window.setTimeout(() => {
        setPhotoArrived(true);
      }, photoArrivalTime);
      
      transitionTo("processing", delay);
      setInitialLoad(false);
      
      return () => {
        if (timer) window.clearTimeout(timer);
        window.clearTimeout(photoTimer);
      };
    } else if (step === "processing") {
      setPhotoArrived(false);
      transitionTo("done", UPLOAD_DURATION);
    } else if (step === "done") {
      setPhotoArrived(false);
      // 链接显示完成后，等待一段时间再显示 logo（让用户看到链接）
      transitionTo("showLogo", 3000);
    } else if (step === "showLogo") {
      // 切换到下一张照片（轮播）
      setCurrentPhotoIndex((prev) => (prev + 1) % oldPhotoUrls.length);
      // 显示 logo 5 秒后继续演示
      transitionTo("idle", 5000);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [initialLoad, step, oldPhotoUrls.length]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative h-[400px] sm:h-[450px]">
        {/* @ts-expect-error - framer-motion AnimatePresence type issue with conditional rendering */}
        <AnimatePresence mode="wait">
          {step === "showLogo" ? (
            <motion.div
              key="showLogo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full flex flex-col items-center justify-center gap-6"
            >
              <Image
                src="/projects/1024logo.png"
                alt="Photo To URL logo"
                width={200}
                height={200}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                unoptimized
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-3xl mx-auto px-4"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-normal tracking-tight text-brand-teal whitespace-nowrap sm:whitespace-normal">
                  <TypewriterUrl text={t("thanksForWatching")} textColor="" speed={thanksTypingSpeed} delay={thanksTypingDelay} />
                </h2>
              </motion.div>
            </motion.div>
          ) : step === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center max-w-lg"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative mb-8 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 500, delay: 0.1 }}
                  className="p-3 bg-brand-teal rounded-full shadow-lg"
                >
                  <Check size={24} className="text-white" strokeWidth={2.5} />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                className="w-full hero-gradient rounded-xl p-4 flex items-center justify-center mb-2"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="text-white">
                    <TypewriterUrl text={SIMULATED_URL} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : step === "processing" ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <div className="relative mb-8 w-16 h-16 flex items-center justify-center">
                <motion.div
                  initial={{ rotate: 0, scale: 1, opacity: 1 }}
                  animate={{ rotate: 360, scale: 0, opacity: 0 }}
                  transition={{
                    rotate: { duration: 1, ease: "easeInOut" },
                    scale: { duration: 1, ease: "easeInOut" },
                    opacity: { duration: 0.6, ease: "easeInOut", delay: 0.4 },
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <FileImage size={64} strokeWidth={1.5} className="text-brand-teal" />
                </motion.div>
                <motion.div
                  initial={{ rotate: -180, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{
                    rotate: { duration: 0.8, ease: "easeOut", delay: 0.5 },
                    scale: { duration: 0.5, ease: "easeOut", delay: 0.6 },
                    opacity: { duration: 0.4, ease: "easeOut", delay: 0.6 },
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <LinkIcon size={64} strokeWidth={1.5} className="text-brand-teal" />
                </motion.div>
              </div>

              <div className="relative w-40 h-1 mb-8">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: UPLOAD_DURATION / 1000, repeat: 0, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full rounded-full ring-2"
                  style={{ boxShadow: "0 0 0 2px rgba(10, 186, 181, 0.4)" } as CSSProperties}
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 h-2 bg-brand-teal rounded-full"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-400 font-mono mt-4 invisible h-0">Optimizing & Uploading...</p>
              </div>
            </motion.div>
          ) : step === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="flex flex-col items-center text-center w-full h-full justify-center cursor-pointer"
            >
              <AutoDemoOverlay step={step} oldPhotoUrl={oldPhotoUrls[currentPhotoIndex]} />

              <motion.div
                className={`flex flex-col items-center justify-center p-6 w-full max-w-xs border-2 border-dashed rounded-2xl bg-transparent transition-all duration-300 group hover:border-brand-teal ${
                  photoArrived ? "border-brand-teal shadow-lg shadow-brand-teal/20" : "border-slate-200"
                }`}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <Plus size={52} strokeWidth={2} className="text-brand-teal" />
                </motion.div>

                <h3 className="text-2xl font-extrabold text-gray-800 mb-2 invisible h-0">
                  {tImages("heroDropTitle")}
                </h3>
                <p className="text-gray-500 text-sm mb-4 invisible h-0">
                  {tImages("heroDropSubtitle")}
                </p>
                <span className="inline-block text-xs font-semibold text-brand-teal bg-teal-100 px-4 py-2 rounded-full shadow-sm invisible h-0">
                  {tImages("heroDropBadge")}
                </span>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}


