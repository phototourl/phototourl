import { NextResponse } from 'next/server';
import { LOCALES } from '@/i18n/routing';

const FALLBACK_BASE_URL = 'https://www.image2url.com';
const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL ?? FALLBACK_BASE_URL).replace(/\/+$/, '');

export async function GET() {
  const now = new Date().toISOString();
  const sitemaps = LOCALES.map(
    (locale) =>
      `<sitemap><loc>${baseUrl}/__sitemap__/${locale}.xml</loc><lastmod>${now}</lastmod></sitemap>`,
  ).join('\n  ');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/__sitemap__/style.xsl"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  ${sitemaps}`,
    '</sitemapindex>',
  ].join('\n');
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
