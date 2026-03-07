# Photo To URL  🌐 **https://phototourl.com**

<div align="center">

**Turn photos into clean, shareable links in seconds.**


[![Website](https://img.shields.io/badge/Website-phototourl.com-teal?style=for-the-badge)](https://phototourl.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

</div>



## ✨ Features

- 🚀 **Fast & Simple** - Upload and get a shareable link in seconds
- 🔗 **Clean URLs** - Direct image links ready for Markdown, HTML, and chat apps
- 📋 **Clipboard Friendly** - Paste screenshots directly from clipboard
- ☁️ **Cloudflare R2 Support** - Optional CDN-backed hosting for fast delivery
- 🌍 **Multi-language** - Supports 9 languages (EN, ZH, ES, FR, PT, DE, JP, KO, AR)
- 🎨 **No Signup Required** - Use it right away, no account needed
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Copy `env.example` to `.env.local` (or set in Vercel):

```env
# Required
NEXT_PUBLIC_SITE_URL=https://phototourl.com
# Optional - Cloudflare R2 (if empty, falls back to local storage)
R2_BUCKET=your-bucket-name
R2_ENDPOINT=your-r2-endpoint
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_PUBLIC_BASE_URL=your-cdn-url
```

### Deploy

1. Push to GitHub and connect to [Vercel](https://vercel.com)
2. Add your environment variables in Vercel dashboard
3. Deploy! 🎉

### Docker / Dokploy 部署（Analytics 生效说明）

Next.js 会把 `NEXT_PUBLIC_*` 在**构建时**写进前端代码，所以必须在**构建阶段**传入，仅填运行时环境变量无效。

**推荐做法：** 在 Dokploy 的 **Build Environment Variables**（构建时环境变量）里添加：

| 变量 | 示例值 |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://phototourl.com` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | `G-**********` |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | `**********`（Yandex 与 GA 一样，不传则不会统计） |

保存后**重新构建并部署**。自检：浏览器打开 `view-source:https://phototourl.com`，搜索 `G-MJP605Q6WY`，若存在则 GA 已生效。

## 🛠️ Tech Stack

- **Framework:** [Next.js 13](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Storage:** Cloudflare R2 (optional) or local storage
- **Deployment:** Vercel

## 📋 多语言与博客文案校验

修改或新增 `messages/*.json` 中的博客文案后，请运行：

```bash
npm run validate:blog
```
或：`node scripts/validate-blog-posts.js`

脚本会检查：

- 所有 JSON 可正常解析
- `blog.posts` 下存在四个博客 slug（与 `src/lib/blog-posts.ts` 一致），且均为**直接子键**，无嵌套
- 每个博客项包含 `title`、`description`、`content` 三个字符串
- 源码中无「圆角博客 content 后仅逗号再接去背景」的典型嵌套错误

若报错，请按提示修正对应语言的 `blog.posts` 结构（例如圆角与去背景必须是两个同级键，圆角对象需用 `},` 正确闭合）。

## 🌐 Related Products

Check out our other tools:

- [Photo to URL](https://phototourl.com) - Turn photos into shareable links
- [Photo to Circle Crop](https://phototourl.com/circle-crop) - Round the corners of images and photos
- [Photo to Rounded Corners](https://phototourl.com/rounded-corners) - Rounded Corners Tool | Free Online Rounded Corner Tool
- [Photo to Remove Background](https://phototourl.com/remove-background)  - Remove Background Tool | Free Online AI Background Remover

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [phototourl](https://github.com/phototourl)

[Website](https://phototourl.com) • [GitHub](https://github.com/phototourl/phototourl) • [Twitter](https://x.com/phototourl)

</div>
