export interface BlogPost {
  id: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  readTime: number; // minutes
  image?: string;
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
