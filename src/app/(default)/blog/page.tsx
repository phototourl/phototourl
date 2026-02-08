import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/app/seo-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

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
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const posts = getAllBlogPosts();
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{t("title")}</h1>
        <p className="text-base md:text-lg text-slate-600">
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
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          {await Promise.all(posts.map(async (post) => {
            const tPost = await getTranslations({ locale, namespace: `blog.posts.${post.slug}` });
            const title = tPost("title");
            const description = tPost("description");
            const postPath = `/blog/${post.slug}`;
            
            return (
              <Link key={post.id} href={postPath} className="block">
                <Card className="flex flex-col h-full hover:shadow-md transition-all hover:border-slate-300 cursor-pointer overflow-hidden">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium capitalize">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg md:text-xl font-semibold mb-2 leading-tight line-clamp-2">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    {/* Footer: Author, Read Time, Tags */}
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <img 
                            src="/favicon.png" 
                            alt={tCommon("siteName")} 
                            className="h-7 w-7 rounded"
                          />
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{post.readTime} {t("min")}</span>
                        </div>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          }))}
        </div>
      )}
    </div>
  );
}


