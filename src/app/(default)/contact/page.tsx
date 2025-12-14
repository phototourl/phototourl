import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Photo to URL",
  description: "Contact Photo to URL support.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-3 text-slate-600">
        Need help or want to share feedback? Email us and we&apos;ll keep an eye on inbox and get back to you as soon as possible.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <div className="font-semibold text-slate-900">Email</div>
        <a className="mt-1 inline-block text-blue-600 hover:underline" href="mailto:leeqs1010@gmail.com">
          leeqs1010@gmail.com
        </a>
      </div>
    </div>
  );
}


