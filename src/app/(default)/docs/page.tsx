import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | Photo to URL",
  description: "Documentation for Photo to URL.",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Docs</h1>
      <p className="mt-3 text-slate-600">
        Quick start: upload an image and get a direct URL. Use the copy/open buttons or download the link in .txt/.json/.md.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <ul className="list-disc pl-5">
          <li>Supported: JPG, PNG, WEBP, GIF</li>
          <li>Fast delivery via CDN when storage is enabled</li>
          <li>Friendly maintenance errors when service is unavailable</li>
        </ul>
      </div>
    </div>
  );
}


