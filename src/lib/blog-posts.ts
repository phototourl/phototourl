export interface BlogPost {
  id: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  readTime: number; // minutes
  image?: string;
  tags?: string[]; // 标签数组
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "how-to-convert-image-to-url-complete-guide",
    date: "2025-02-08",
    author: "Photo To URL Team",
    category: "tutorial",
    readTime: 8,
    image: "/og-image.png",
    tags: ["photo-to-url", "image-hosting", "cdn", "tutorial"],
  },
];

// Get blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
