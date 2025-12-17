import { NextResponse } from 'next/server';

const FALLBACK_BASE_URL = 'https://www.image2url.com';
const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL ?? FALLBACK_BASE_URL).replace(/\/+$/, '');

export async function GET() {
  return NextResponse.redirect(`${baseUrl}/sitemap_index.xml`, 308);
}
