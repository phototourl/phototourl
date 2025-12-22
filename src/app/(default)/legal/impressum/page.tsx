import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteUrl } from "@/app/seo-metadata";

export const metadata: Metadata = {
  title: "Impressum | Photo To URL",
  description: "Impressum for Photo To URL.",
  alternates: {
    canonical: `${siteUrl}/legal/impressum`,
  },
  openGraph: {
    title: "Impressum | Photo To URL",
    description: "Impressum for Photo To URL.",
    url: `${siteUrl}/legal/impressum`,
  },
  twitter: {
    title: "Impressum | Photo To URL",
    description: "Impressum for Photo To URL.",
  },
};

export default function ImpressumPage() {
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">Impressum</h1>
      <p className="mt-4 text-slate-700">Operator: Photo To URL</p>
      <p className="mt-2 text-slate-700">
        Contact: <a className="text-blue-600 hover:underline" href="mailto:leeqs1010@gmail.com">leeqs1010@gmail.com</a>
      </p>
    </LegalPage>
  );
}


