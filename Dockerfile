# ========== 阶段 1：安装依赖 ==========
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ========== 阶段 2：构建 ==========
# 在 Dokploy 的 Build-time Arguments 里填写以下变量即可生效（如 NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-MJP605Q6WY）
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
