# ========== 阶段 1：安装依赖 ==========
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ========== 阶段 2：构建 ==========
# 重要：NEXT_PUBLIC_* 在 Next 里是构建时内联的，必须在 build 前传入。
# 方法1（推荐）：在 Dokploy 的 Build Environment Variables 里添加，例如：
#   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-MJP605Q6WY
#   NEXT_PUBLIC_YANDEX_METRIKA_ID=105949212
#   NEXT_PUBLIC_SITE_URL=https://phototourl.com
# 方法2：docker build 时加 --build-arg NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-MJP605Q6WY 等。
# 若构建时未传，前端 HTML 里不会包含 GA/Yandex 脚本，统计不生效。部署后可用 view-source:https://phototourl.com 搜索 G-MJP605Q6WY 自检。
FROM node:20-alpine AS builder
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN
ARG NEXT_PUBLIC_ANALYTICS_SRC
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN=$NEXT_PUBLIC_ANALYTICS_DOMAIN
ENV NEXT_PUBLIC_ANALYTICS_SRC=$NEXT_PUBLIC_ANALYTICS_SRC
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ========== 阶段 3：运行（standalone 输出，体积小） ==========
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 使用 standalone 时，静态与 public 需单独复制
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
