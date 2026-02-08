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
  
  // 暂时禁用 AdSense（账户因"低价值内容"违规被限制，需等到 2026年3月19日才能重新申请审核）
  // 在修复内容质量问题之前，不加载 AdSense 代码
  const shouldLoadAdSense = false; // 暂时禁用，等待内容质量提升后重新启用
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
        {/* Google AdSense - 只在生产环境加载 */}
        {shouldLoadAdSense && (
          <>
            <meta
              name="google-adsense-account"
              content="ca-pub-4341915232925745"
            />
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4341915232925745"
              crossOrigin="anonymous"
            />
            {/* 静默处理 AdSense 403 错误，避免控制台显示 */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    // 拦截 AdSense 相关的网络错误
                    const originalFetch = window.fetch;
                    if (originalFetch) {
                      window.fetch = function(...args) {
                        const url = args[0];
                        if (url && typeof url === 'string' && url.includes('doubleclick.net')) {
                          return originalFetch.apply(this, args).catch(function(error) {
                            // 静默处理 AdSense 403 错误
                            console.debug('AdSense request failed (this is normal if domain is not verified)');
                            return Promise.resolve(new Response('', { status: 200, headers: { 'Content-Type': 'text/html' } }));
                          });
                        }
                        return originalFetch.apply(this, args);
                      };
                    }
                    // 拦截 script 标签加载错误
                    window.addEventListener('error', function(e) {
                      if (e.target && e.target.tagName === 'SCRIPT' && 
                          e.target.src && e.target.src.includes('adsbygoogle')) {
                        e.preventDefault();
                        e.stopPropagation();
                        return true;
                      }
                    }, true);
                  })();
                `,
              }}
            />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}", "ym");
              var metrikaId = ${YANDEX_METRIKA_ID};
              setTimeout(function() {
                if (typeof ym !== 'undefined') {
                  ym(metrikaId, "init", {
                    clickmap: true,
                    trackLinks: true,
                    accurateTrackBounce: true,
                    webvisor: true
                  });
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
