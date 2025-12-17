# Photo to URL

<div align="center">

**Turn photos into clean, shareable links in seconds**

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

## 🛠️ Tech Stack

- **Framework:** [Next.js 13](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Storage:** Cloudflare R2 (optional) or local storage
- **Deployment:** Vercel

## 🌐 Related Products

Check out our other tools:

- [Circle Crop Image](https://circlecropimage.qzboat.com) - Round the corners of images
- [Discord Wrapped](https://discordwarpped.qzboat.com) - Personalized Discord stats
- [qzboat](https://www.qzboat.com) - Professional AI SaaS Platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [phototourl](https://github.com/phototourl)

[Website](https://phototourl.com) • [GitHub](https://github.com/phototourl/phototourl) • [Twitter](https://x.com/phototourl)

</div>
