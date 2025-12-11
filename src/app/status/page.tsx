import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status | Photo to URL",
  description: "Service status placeholder for Photo to URL.",
};

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Status</h1>
      <p className="mt-3 text-slate-600">
        Live status page will be available soon. For now, the service is online.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Planned:
        <ul className="mt-2 list-disc pl-5">
          <li>Uptime and latency metrics</li>
          <li>Incident history and maintenance windows</li>
          <li>Webhook/feeds for subscribers</li>
        </ul>
      </div>
    </div>
  );
}

