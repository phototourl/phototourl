import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Photo to URL",
  description: "Frequently asked questions about Photo to URL.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">FAQ</h1>
      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="font-semibold text-slate-900">Is it free?</div>
          <p className="mt-2 text-sm text-slate-600">Yes. Core upload-to-link is free.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="font-semibold text-slate-900">What formats are supported?</div>
          <p className="mt-2 text-sm text-slate-600">JPG, PNG, WEBP, GIF (up to your configured limit).</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="font-semibold text-slate-900">Can I use it in Markdown/HTML?</div>
          <p className="mt-2 text-sm text-slate-600">Yes. Copy the URL or download as .md/.html.</p>
        </div>
      </div>
    </div>
  );
}


