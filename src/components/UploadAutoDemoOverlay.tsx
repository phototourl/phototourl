"use client";

import { motion } from "framer-motion";

type UploadAutoDemoOverlayProps = {
  imageSrc: string;
  fileTag?: string;
};

/**
 * 复刻 PhotoToUrlLandingPage.jsx 的 AutoDemoOverlay 思路：
 * “老照片缩略图 + 手指”从外侧飞入到上传入口中心，循环播放。
 * 仅做视觉演示，不拦截任何点击/拖拽（pointer-events-none）。
 */
export default function UploadAutoDemoOverlay({
  imageSrc,
  fileTag = "OLD",
}: UploadAutoDemoOverlayProps) {
  const FileToDrag = () => (
    <motion.div
      className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
      animate={{ rotate: [-6, 6, -6] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt="" className="h-full w-full object-cover" />
      <div className="absolute -right-2 -top-2 rounded-full bg-brand-teal px-2 py-1 text-[10px] font-bold text-white shadow-sm">
        {fileTag}
      </div>
    </motion.div>
  );

  // 你原代码里的 HandPointer（自定义 SVG）基本照搬
  const HandPointer = () => (
    <motion.svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute text-slate-900"
      style={{ x: 0, y: 0, transform: "rotate(20deg) translate(-20%, -30%)" }}
    >
      <path d="M12 2.5C12 2.224 11.776 2 11.5 2h-4C6.671 2 6 2.671 6 3.5V11H4C3.448 11 3 11.448 3 12v4.5C3 18.435 4.565 20 6.5 20h3C10.881 20 12 18.881 12 17.5V2.5Z" />
      <path d="M13 10V4.5C13 3.671 13.671 3 14.5 3h1C16.329 3 17 3.671 17 4.5V10.5C17 11.329 16.329 12 15.5 12h-1C13.671 12 13 11.329 13 10.5V10Z" />
      <path d="M17 10V5.5C17 4.671 17.671 4 18.5 4h1C20.329 4 21 4.671 21 5.5V10.5C21 11.329 20.329 12 19.5 12h-1C17.671 12 17 11.329 17 10.5V10Z" />
      <rect x="0" y="0" width="24" height="24" fill="none" />
    </motion.svg>
  );

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20"
      initial={{ x: -170, y: -120, scale: 0.85, opacity: 1 }}
      animate={{
        x: [-170, 0, 0, -170],
        y: [-120, 0, 0, -120],
        scale: [0.85, 1, 1, 0.85],
        opacity: [1, 1, 0, 0],
      }}
      transition={{
        duration: 4.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.8,
      }}
      style={{ translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
        <FileToDrag />
        <HandPointer />
      </motion.div>
    </motion.div>
  );
}


