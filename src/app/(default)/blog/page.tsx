import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Photo to URL",
  description: "Articles about photo hosting, link sharing, and performance tips.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
      <p className="mt-3 text-slate-600">
        We&apos;re preparing articles on photo hosting, CDN, link sharing, and SEO tips. Content coming soon.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Stay tuned for guides on:
        <ul className="mt-2 list-disc pl-5">
          <li>Best practices for image to URL conversion</li>
          <li>How to use direct photo links in blogs and docs</li>
          <li>Performance and caching for static assets</li>
        </ul>
      </div>
    </div>
  );
}


