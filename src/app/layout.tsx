import "./globals.css";
import type { Metadata } from "next";
import { baseMetadata } from "./seo-metadata";
import type { ReactNode } from "react";
import localFont from "next/font/local";

export const metadata: Metadata = baseMetadata;

// 只加载必要的字体变体以提升性能
const inter = localFont({
  src: [
    { path: "./api/image/Inter/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./api/image/Inter/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./api/image/Inter/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./api/image/Inter/Inter-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

/**
 * 根布局只负责提供 <html><body> 与全局样式/字体。
 * 具体的 i18n Provider + Header/Footer 由 app/(default)/layout.tsx 与 app/[locale]/layout.tsx 提供。
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "105949212";
  
  // 调试：在服务端输出环境变量（只在服务端可见，不会出现在浏览器控制台）
  if (typeof window === "undefined") {
    console.log("[服务端] NEXT_PUBLIC_YANDEX_METRIKA_ID:", process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);
    console.log("[服务端] 使用的 ID:", YANDEX_METRIKA_ID);
  }
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("🔍 [Yandex.Metrika] 根 Layout 脚本执行");
              console.log("🔍 [Yandex.Metrika] 环境变量 NEXT_PUBLIC_YANDEX_METRIKA_ID:", "${process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "未设置"}");
              console.log("🔍 [Yandex.Metrika] 使用的 ID: ${YANDEX_METRIKA_ID}");
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}", "ym");
              console.log("✅ [Yandex.Metrika] ym 函数已创建，等待脚本加载...");
              var metrikaId = ${YANDEX_METRIKA_ID};
              setTimeout(function() {
                try {
                  if (typeof ym !== 'undefined') {
                    ym(metrikaId, "init", {
                      clickmap: true,
                      trackLinks: true,
                      accurateTrackBounce: true,
                      webvisor: true
                    });
                    console.log("✅ [Yandex.Metrika] 初始化成功，ID: " + metrikaId);
                  } else {
                    console.error("❌ [Yandex.Metrika] ym 函数未定义");
                  }
                } catch(e) {
                  console.error("❌ [Yandex.Metrika] 初始化失败:", e);
                }
              }, 100);
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body className={`${inter.className} bg-white text-slate-900`}>{children}</body>
    </html>
  );
}
