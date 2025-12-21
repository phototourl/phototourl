"use client";

import Script from "next/script";
import { useEffect } from "react";

const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "105949212";

// 在模块加载时就输出日志
console.log("🔍 [Yandex.Metrika] 模块已加载，ID:", YANDEX_METRIKA_ID);

export default function YandexMetrika() {
  // 在组件渲染时立即输出日志（不使用 useEffect）
  console.log("🔍 [Yandex.Metrika] 组件开始渲染，ID:", YANDEX_METRIKA_ID);
  
  // 在组件挂载时立即输出日志
  useEffect(() => {
    console.log("🔍 [Yandex.Metrika] useEffect 执行，组件已挂载，ID:", YANDEX_METRIKA_ID);
    console.log("🔍 [Yandex.Metrika] 环境变量 NEXT_PUBLIC_YANDEX_METRIKA_ID:", process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);
  }, []);

  if (!YANDEX_METRIKA_ID) {
    console.error("❌ [Yandex.Metrika] 错误：未配置 ID");
    return null;
  }
  
  console.log("🔍 [Yandex.Metrika] 组件返回 JSX，ID:", YANDEX_METRIKA_ID);

  return (
    <>
      {/* 测试：确认组件是否渲染 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `console.log("🔍 [Yandex.Metrika] 测试脚本执行，组件已渲染，ID: ${YANDEX_METRIKA_ID}");`,
        }}
      />
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ [Yandex.Metrika] Script 组件 onLoad 回调执行");
        }}
        onError={(e) => {
          console.error("❌ [Yandex.Metrika] Script 组件加载失败:", e);
        }}
        onReady={() => {
          console.log("✅ [Yandex.Metrika] Script 组件 onReady 回调执行");
        }}
      >
        {`
          console.log("🔍 [Yandex.Metrika] 内联脚本开始执行，ID: ${YANDEX_METRIKA_ID}");
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          
          console.log("✅ [Yandex.Metrika] ym 函数已创建");
          
          try {
            ym(${YANDEX_METRIKA_ID}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true
            });
            console.log("✅ [Yandex.Metrika] 初始化成功，ID: ${YANDEX_METRIKA_ID}");
          } catch(e) {
            console.error("❌ [Yandex.Metrika] 初始化失败:", e);
          }
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

