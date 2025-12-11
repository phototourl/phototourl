# phototourl

Photo to URL Converter – Next.js app to upload photos and get clean, shareable URLs.  
Supports local storage with Cloudflare R2 upload when configured.

## Development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Environment

Copy `env.example` to `.env.local` (or set in Vercel):
- `NEXT_PUBLIC_SITE_URL`
- `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL` (optional; if empty falls back to local)

## Deploy
- Push to GitHub and connect to Vercel.
- Add your Cloudflare R2 vars to Vercel env, redeploy.

## License

MIT
