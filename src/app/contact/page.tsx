import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Photo to URL",
  description: "Get in touch about Photo to URL.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-3 text-slate-600">
        Need to reach us about Photo to URL? Drop a note to the team.
      </p>
      <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <p>Email: <a className="text-blue-600 underline" href="mailto:leeqs1010@gmail.com">leeqs1010@gmail.com</a></p>
        <p>We keep an eye on inbox and will get back to you as soon as possible.</p>
      </div>
    </div>
  );
}

