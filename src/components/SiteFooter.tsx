import Link from "next/link";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "/status" },
  { label: "Contact", href: "/contact" },
];

const productLinks = [
  { label: "Image to URL", href: "https://www.image2url.com/" },
  { label: "Circle Crop Image", href: "https://circlecropimage.qzboat.com/" },
  { label: "Discord Wrapped", href: "https://discordwarpped.qzboat.com/" },
  { label: "qzboat", href: "https://www.qzboat.com/" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="bg-gradient-to-r from-[#0b3a5c] via-[#0b4f73] to-[#0b3a5c] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:max-w-7xl lg:px-10 lg:py-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-3">
              <div className="text-2xl font-semibold">Photo to URL</div>
              <p className="text-sm text-white/80 leading-relaxed">
                Turn photos into clean, shareable links. Fast, simple, reliable.
              </p>
              <div className="text-sm text-white/80">
                Partners:{" "}
                <a
                  href="https://luolink.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Luolink
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/70">Links</div>
              <div className="flex flex-col gap-2 text-sm text-white/85">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/70">Products</div>
              <div className="flex flex-col gap-2 text-sm text-white/85 leading-relaxed">
                {productLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 underline-offset-4 hover:underline break-words"
                  >
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-slate-900 text-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs lg:max-w-7xl lg:px-10">
          <span>© {new Date().getFullYear()} Photo to URL. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

