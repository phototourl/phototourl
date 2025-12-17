import { NextResponse } from 'next/server';

const FALLBACK_BASE_URL = 'https://www.image2url.com';
const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL ?? FALLBACK_BASE_URL).replace(/\/+$/, '');

export async function GET(_: Request, { params }: { params: Promise<{ locale?: string }> }) {
  const { locale = 'en' } = await params;
  return NextResponse.redirect(`${baseUrl}/__sitemap__/${locale}.xml`, 308);
}
