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
    date: "2025-12-01",
    author: "Photo To URL Team",
    category: "tutorial",
    readTime: 8,
    image: "/og-image.png",
    tags: ["photo-to-url", "image-hosting", "cdn", "tutorial"],
  },
  {
    id: "2",
    slug: "how-to-crop-images-in-circle-shape",
    date: "2026-01-09",
    author: "Photo To URL Team",
    category: "tutorial",
    readTime: 6,
    image: "/blog/b-circle-crop.png",
    tags: ["circle-crop", "image-editing", "profile-picture", "tutorial"],
  },
  {
    id: "3",
    slug: "photo-to-rounded-corners-guide",
    date: "2026-02-12",
    author: "Photo To URL Team",
    category: "tutorial",
    readTime: 5,
    image: "/blog/b-rounded-corners.png",
    tags: ["rounded-corners", "image-editing", "ui-design", "tutorial"],
  },
  {
    id: "4",
    slug: "photo-to-remove-background-guide",
    date: "2026-03-01",
    author: "Photo To URL Team",
    category: "tutorial",
    readTime: 6,
    image: "/blog/b-remove-background.png",
    tags: ["remove-background", "image-editing", "ai", "tutorial"],
  },
];

// Get blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
