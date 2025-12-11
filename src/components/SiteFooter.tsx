import Link from "next/link";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "/status" },
  { label: "Contact", href: "/contact" },
  { label: "Circle Crop Image", href: "https://circlecropimage.qzboat.com/", external: true },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-slate-900">Photo to URL</div>
          <p className="text-sm text-slate-500">
            Turn photos into clean, shareable links. Fast, simple, reliable.
          </p>
          <div className="text-sm text-slate-600">
            Partners:{" "}
            <a
              href="https://luolink.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline-offset-4 hover:underline"
            >
              Luolink
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:text-slate-900 hover:underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="underline-offset-4 hover:text-slate-900 hover:underline"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <a
            href="https://vercel.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-300 hover:text-slate-700"
          >
            Powered by Vercel
          </a>
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-300 hover:text-slate-700"
          >
            Built with Next.js
          </a>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Photo to URL. All rights reserved.</span>
          <div className="flex gap-3">
            <Link href="/legal/privacy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

