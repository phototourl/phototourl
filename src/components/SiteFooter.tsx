import { LocaleLink } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const navLinks = [
  { key: "blog", href: "/blog" },
  { key: "docs", href: "/docs" },
  { key: "status", href: "/status" },
  { key: "contact", href: "/contact" },
  { key: "home", href: "/" },
] as const;

const productLinks = [
  { label: "Image to URL", href: "https://www.image2url.com/" },
  { label: "Circle Crop Image", href: "https://circlecropimage.qzboat.com/" },
  { label: "Discord Wrapped", href: "https://discordwarpped.qzboat.com/" },
  { label: "qzboat", href: "https://www.qzboat.com/" },
];

export async function SiteFooter() {
  const t = await getTranslations("common");
  return (
    <footer className="mt-8">
      <div className="border-t border-white/15 hero-gradient text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-8 lg:py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-3">
              <div className="text-2xl font-semibold text-white">{t("siteName")}</div>
              <p className="max-w-xs text-sm text-white/90 leading-relaxed">
                {t("footer.blurb.line1")}
                <br />
                {t("footer.blurb.line2")}
              </p>
              <div className="text-sm text-white/90">
                {t("footer.partners")}:{" "}
                <a
                  href="https://luolink.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-white underline underline-offset-4 hover:text-white/90"
                >
                  Luolink
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("footer.linksTitle")}</div>
              <div className="flex flex-col gap-2 text-sm text-white/95">
                {navLinks.map((link) => (
                  <LocaleLink
                    key={link.href}
                    href={link.href}
                    className="underline-offset-4 hover:text-white hover:underline"
                  >
                    {t(`footer.nav.${link.key}`)}
                  </LocaleLink>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("footer.productsTitle")}</div>
              <div className="flex flex-col gap-2 text-sm text-white/95 leading-relaxed">
                {productLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 underline-offset-4 hover:text-white hover:underline break-words"
                  >
                    <span className="h-2 w-2 rounded-full bg-white/70" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white text-slate-600">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-xs lg:px-8">
          <span className="text-slate-600">{t("footer.copyright")}</span>
          <div className="flex items-center">
            <LocaleLink href="/legal/privacy" className="hover:text-brand-teal">
              {t("footer.legal.privacy")}
            </LocaleLink>
            <span className="mx-3 text-slate-400">•</span>
            <LocaleLink href="/legal/terms" className="hover:text-brand-teal">
              {t("footer.legal.terms")}
            </LocaleLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

