import Link from "next/link";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "/status" },
  { label: "Contact", href: "/contact" },
  { label: "Home", href: "/" },
];

const productLinks = [
  { label: "Image to URL", href: "https://www.image2url.com/" },
  { label: "Circle Crop Image", href: "https://circlecropimage.qzboat.com/" },
  { label: "Discord Wrapped", href: "https://discordwarpped.qzboat.com/" },
  { label: "qzboat", href: "https://www.qzboat.com/" },
];

export function SiteFooter() {
  return (
    <footer className="mt-8">
      <div className="bg-gradient-to-r from-[#0b3a5c] via-[#0b4f73] to-[#0b3a5c] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-8 lg:py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-3">
              <div className="text-2xl font-semibold">Photo to URL</div>
              <p className="max-w-xs text-sm text-white/85 leading-relaxed">
                Turn photos into clean, shareable links.
                <br />
                Fast, simple, reliable.
              </p>
              <div className="text-sm text-white/80">
                Partners:{" "}
                <a
                  href="https://luolink.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Luolink
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/70">Links</div>
              <div className="flex flex-col gap-2 text-sm text-white/90">
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

            <div className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/70">Products</div>
              <div className="flex flex-col gap-2 text-sm text-white/90 leading-relaxed">
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
      <div className="bg-slate-900 text-white/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-xs lg:px-8">
          <span>© 2025 Photo to URL. All rights reserved.</span>
          <div className="flex items-center">
            <Link href="/legal/privacy" className="hover:text-white">
              Privacy
            </Link>
            <span className="mx-3 text-white/40">•</span>
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

