import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | Photo to URL",
  description: "Documentation placeholder for Photo to URL. Upload, link, and embed photos easily.",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Docs</h1>
      <p className="mt-3 text-slate-600">
        Documentation is on the way. We&apos;ll cover upload endpoints, usage examples, and best practices.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Planned topics:
        <ul className="mt-2 list-disc pl-5">
          <li>How to upload images and get URLs</li>
          <li>Embedding images in HTML, Markdown, and chat apps</li>
          <li>Limits, formats, and roadmap for storage/CDN</li>
        </ul>
      </div>
    </div>
  );
}

