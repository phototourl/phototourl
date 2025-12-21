import { LocaleLink } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Github, Twitter } from "lucide-react";

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
  const tImages = await getTranslations("images");
  return (
    <footer className="mt-8">
      <div className="border-t border-white/15 hero-gradient text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-white/10">
                  <Image
                    src="/icons/light_58x58.png"
                    alt={tImages("logoAlt")}
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-xl font-semibold text-white">{t("siteName")}</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/phototourl"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/phototourl"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
              <LanguageSwitcher variant="footer" />
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
              <div className="flex flex-col gap-2 text-sm text-white/95">
                {productLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-4 hover:text-white hover:underline break-words"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("footer.partners")}</div>
              <a
                href="https://luolink.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/95 hover:text-white hover:underline underline-offset-4 block"
              >
                Luolink
              </a>
            </div>
          </div>
          {/* Badge row: centered, full-width, between content and bottom border */}
          <div className="mt-4 flex flex-nowrap items-center justify-center gap-2 overflow-hidden">
            <a
              href="https://fazier.com/launches/phototourl.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light"
                width={120}
                height={28}
                alt="Fazier badge"
                className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity shrink-0"
              />
            </a>
            <a
              href="https://showmebest.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://showmebest.ai/badge/feature-badge-dark.webp"
                width={120}
                height={28}
                alt="Featured on ShowMeBestAI"
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://submitaitools.org"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://submitaitools.org/static_submitaitools/images/submitaitools.png"
                width={120}
                height={28}
                alt="Submit AI Tools – The ultimate platform to discover, submit, and explore the best AI tools across various categories."
                className="h-6 w-auto rounded-[10px] shrink-0"
              />
            </a>
            <a
              href="https://twelve.tools"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://twelve.tools/badge0-light.svg"
                width={120}
                height={28}
                alt="Featured on Twelve Tools"
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://wired.business"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://wired.business/badge3-dark.svg"
                width={120}
                height={28}
                alt="Featured on Wired Business"
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://frogdr.com/phototourl.com?utm_source=phototourl.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://frogdr.com/phototourl.com/badge-white.svg"
                width={120}
                height={28}
                alt="Monitor your Domain Rating with FrogDR"
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://findly.tools/photo-to-url?utm_source=photo-to-url"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://findly.tools/badges/findly-tools-badge-light.svg"
                alt="Featured on findly.tools"
                width={150}
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://goodaitools.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://goodaitools.com/assets/images/badge.png"
                alt="Good AI Tools"
                height={54}
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://dofollow.tools"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://dofollow.tools/badge/badge_light.svg"
                alt="Featured on Dofollow.Tools"
                width={200}
                height={54}
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://turbo0.com/item/photo-to-url"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://img.turbo0.com/badge-listed-light.svg"
                alt="Listed on Turbo0"
                height={54}
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://aiagentsdirectory.com?utm_source=badge&utm_medium=referral&utm_campaign=free_listing&utm_content=homepage"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
                alt="Featured AI Agents on AI Agents Directory"
                width={200}
                height={50}
                className="h-6 w-auto shrink-0"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 hero-gradient text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-3 text-xs lg:px-8">
          <div className="flex items-center gap-4">
            <span className="text-white/90">{t("footer.copyright")}</span>
            <div className="flex items-center">
              <LocaleLink href="/legal/privacy" className="hover:text-white">
                {t("footer.legal.privacy")}
              </LocaleLink>
              <span className="mx-3 text-white/40">•</span>
              <LocaleLink href="/legal/terms" className="hover:text-white">
                {t("footer.legal.terms")}
              </LocaleLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

