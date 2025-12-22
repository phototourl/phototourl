import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteUrl } from "@/app/seo-metadata";

export const metadata: Metadata = {
  title: "Terms of Service | Photo To URL",
  description: "Terms of Service for Photo To URL.",
  alternates: {
    canonical: `${siteUrl}/legal/terms`,
  },
  openGraph: {
    title: "Terms of Service | Photo To URL",
    description: "Terms of Service for Photo To URL.",
    url: `${siteUrl}/legal/terms`,
  },
  twitter: {
    title: "Terms of Service | Photo To URL",
    description: "Terms of Service for Photo To URL.",
  },
};

export default function TermsPage() {
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-slate-700">
        By using Photo To URL, you agree to use the service responsibly and not upload illegal content.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Disclaimer</h2>
      <p className="mt-2 text-slate-700">
        The service is provided &quot;as is&quot; without warranties. Availability may change due to maintenance.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-2 text-slate-700">
        Email <a className="text-blue-600 hover:underline" href="mailto:leeqs1010@gmail.com">leeqs1010@gmail.com</a>.
      </p>
    </LegalPage>
  );
}


