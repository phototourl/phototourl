import "./globals.css";
import type { Metadata } from "next";
import { baseMetadata } from "./seo-metadata";
import type { ReactNode } from "react";
import localFont from "next/font/local";

export const metadata: Metadata = baseMetadata;

const inter = localFont({
  src: [
    { path: "./api/image/Inter/Inter-Thin.ttf", weight: "100", style: "normal" },
    { path: "./api/image/Inter/Inter-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "./api/image/Inter/Inter-Light.ttf", weight: "300", style: "normal" },
    { path: "./api/image/Inter/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./api/image/Inter/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./api/image/Inter/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./api/image/Inter/Inter-Bold.ttf", weight: "700", style: "normal" },
    { path: "./api/image/Inter/Inter-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./api/image/Inter/Inter-Black.ttf", weight: "900", style: "normal" },
  ],
  display: "swap",
});

/**
 * 根布局只负责提供 <html><body> 与全局样式/字体。
 * 具体的 i18n Provider + Header/Footer 由 app/(default)/layout.tsx 与 app/[locale]/layout.tsx 提供。
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} bg-white text-slate-900`}>{children}</body>
    </html>
  );
}
