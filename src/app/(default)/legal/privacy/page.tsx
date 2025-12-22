import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteUrl } from "@/app/seo-metadata";

export const metadata: Metadata = {
  title: "Privacy Policy | Photo To URL",
  description: "Privacy Policy for Photo To URL.",
  alternates: {
    canonical: `${siteUrl}/legal/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | Photo To URL",
    description: "Privacy Policy for Photo To URL.",
    url: `${siteUrl}/legal/privacy`,
  },
  twitter: {
    title: "Privacy Policy | Photo To URL",
    description: "Privacy Policy for Photo To URL.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-slate-700">
        We collect the minimum necessary data to operate the service. Uploaded images are stored to generate a shareable link.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-2 text-slate-700">
        Questions? Email <a className="text-blue-600 hover:underline" href="mailto:leeqs1010@gmail.com">leeqs1010@gmail.com</a>.
      </p>
    </LegalPage>
  );
}


