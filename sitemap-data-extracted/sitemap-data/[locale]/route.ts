import { NextResponse } from 'next/server';
import { LOCALES } from '@/i18n/routing';
import { blogSource } from '@/lib/source';

const FALLBACK_BASE_URL = 'https://www.image2url.com';
const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL ?? FALLBACK_BASE_URL).replace(/\/+$/, '');

const staticPaths = [
  '',
  'about',
  'privacy',
  'terms',
  'tools',
  'image-to-icon',
  'image-to-link',
  'audio-to-link',
  'pdf-to-url',
  'video-to-url',
  'gif-to-url',
  'mp3-to-link',
  'file-to-url',
  'bulk-image-upload',
  'picture-to-url',
  'photo-to-url-converter',
  'image-url-generator',
  'ppt-to-url-converter',
  'html-to-url',
  'qr-to-url',
  'convert-youtube-redirect-links-to-url',
  'base64-to-url',
  'url-expander',
  'url-opener',
  'url-parser',
  'batch-url-checker',
  'image-to-webp-converter',
  'tools/mcp-server-image2url',
  'tools/sdk-server-image2url',
  'tools/colab-sever-image2url',
  'tools/overlay-images',
  'tools/image-to-pencil-sketch',
  'tools/make-photo-black-and-white',
  'tools/image-to-blur-converter',
  'tools/image-inverter',
  'tools/add-timestamp-to-photo',
  'tools/feet-to-pixel',
  'tools/heic-viewer-and-to-png',
  'tools/image-corner-rounder',
  'tools/square-image',
  'tools/image-max-url-finder',
  'tools/crop-a-circle',
  'tools/huggingface-sever-image2url',
  'tools/pypi-sever-image2url',
];

async function getBlogPaths(locale: string) {
  const posts = await blogSource.getPages(locale);
  return posts
    .filter((post) => post.data.published !== false)
    .map((post) => `blog/${post.slugs.join('/')}`);
}

function languagesMap(route: string) {
  const langRoute = route ? `/${route}` : '';
  const defaultHref = `${baseUrl}${langRoute}`;

  const alternates = LOCALES.map((lang) => {
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    return `<xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${langPrefix}${langRoute}" />`;
  }).join('');

  return `${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}" />`;
}

export async function GET(_: Request, { params }: { params: Promise<{ locale?: string }> }) {
  const { locale = 'en' } = await params;
  const now = new Date().toISOString();
  const isDefault = locale === 'en';
  const prefix = isDefault ? '' : `/${locale}`;
  const blogPaths = await getBlogPaths(locale);
  const routes = [...staticPaths, ...blogPaths];

  const urls = routes
    .map((path) => {
      const route = path ? `/${path}` : '';
      const url = `${baseUrl}${prefix}${route}`;
      const freq = path === '' ? 'daily' : 'weekly';
      const priority = path === '' ? '1.0' : '0.8';
      return `<url><loc>${url}</loc>${languagesMap(path)}<lastmod>${now}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join('\n  ');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/__sitemap__/style.xsl"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  ${urls}`,
    '</urlset>',
  ].join('\n');

  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
