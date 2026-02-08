import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug } from "@/lib/blog-posts";
import MarkdownContent from "@/components/MarkdownContent";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const tPost = await getTranslations({ locale, namespace: `blog.posts.${slug}` });
  const title = tPost("title");
  const description = tPost("description");
  const canonicalPath = `/blog/${slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    title: `${title} | Photo To URL Blog`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image && { images: [post.image] }),
    },
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
      ...(post.image && { images: [post.image] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog.page" });
  const { slug } = await params;
  
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const tPost = await getTranslations({ locale, namespace: `blog.posts.${slug}` });
  const title = tPost("title");
  const description = tPost("description");
  const content = tPost("content");

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      {/* Back to blog link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToBlog")}
      </Link>

      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readTime} {t("minRead")}</span>
          </div>
          {post.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {post.category}
            </span>
          )}
        </div>

        {post.image && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg bg-slate-100 mb-8">
            <img
              src={post.image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <p className="text-xl text-slate-600 leading-relaxed">
          {description}
        </p>
      </header>

      {/* Article content */}
      <div className="prose prose-lg max-w-none">
        <MarkdownContent content={content} />
      </div>

      {/* Article footer */}
      <footer className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">
              {t("author")}: <span className="font-medium text-slate-900">{post.author}</span>
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("viewMoreArticles")} →
          </Link>
        </div>
      </footer>
    </article>
  );
}
