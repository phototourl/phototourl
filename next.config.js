// next-intl 插件指向请求配置（App Router 推荐）
const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化：压缩输出
  compress: true,
  // 性能优化：启用 SWC 压缩
  swcMinify: true,
  // 性能优化：图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 性能优化：添加 favicon 缓存头
  async headers() {
    return [
      {
        source: "/favicon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // 默认语言英文不带前缀：避免 /en 与 / 重复内容
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
