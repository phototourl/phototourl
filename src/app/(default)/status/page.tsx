import type { Metadata } from "next";
import { siteUrl } from "@/app/seo-metadata";

export const metadata: Metadata = {
  title: "Status | Photo To URL",
  description: "Service status for Photo To URL.",
  alternates: {
    canonical: `${siteUrl}/status`,
  },
  openGraph: {
    title: "Status | Photo To URL",
    description: "Service status for Photo To URL.",
    url: `${siteUrl}/status`,
  },
  twitter: {
    title: "Status | Photo To URL",
    description: "Service status for Photo To URL.",
  },
};

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Status</h1>
      <p className="mt-3 text-slate-600">All systems operational.</p>
      <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
        Upload API and CDN links are running.
      </div>
    </div>
  );
}


