import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "blog.seo" });
  const canonicalPath = "/blog";
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function BlogPage() {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog.page" });
  const posts = getAllBlogPosts();
  
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-3 text-lg text-slate-600">
          {t("description")}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          {t("stayTuned")}
          <ul className="mt-2 list-disc pl-5">
            <li>{t("guides.1")}</li>
            <li>{t("guides.2")}</li>
            <li>{t("guides.3")}</li>
          </ul>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {await Promise.all(posts.map(async (post) => {
            const tPost = await getTranslations({ locale, namespace: `blog.posts.${post.slug}` });
            const title = tPost("title");
            const description = tPost("description");
            const postPath = `/blog/${post.slug}`;
            
            return (
              <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {post.image && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-slate-100">
                    <img
                      src={post.image}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime} {t("min")}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link
                    href={postPath}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t("readMore")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          }))}
        </div>
      )}
    </div>
  );
}


