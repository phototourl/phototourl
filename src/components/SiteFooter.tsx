import { LocaleLink } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Github, Twitter } from "lucide-react";
import dynamic from "next/dynamic";

const CircleCropTypewriter = dynamic(() => import("./CircleCropTypewriter").then(mod => ({ default: mod.CircleCropTypewriter })), {
  ssr: false,
});

const navLinks = [
  { key: "about", href: "/about" },
  { key: "docs", href: "/docs" },
  { key: "blog", href: "/blog" },
  { key: "status", href: "/status" },
  { key: "contact", href: "/contact" },
] as const;

const productLinks = [
  { labelKey: "title", ns: "circleCrop", href: "/circlecrop", external: false },
  { href: "/roundedcorners", external: false },
  { label: "Image to URL", href: "https://www.image2url.com/", external: true },
];

type SiteFooterProps = { locale: string };

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations({ locale, namespace: "common" });
  const tImages = await getTranslations({ locale, namespace: "images" });
  return (
    <footer>
      <div className="border-t border-white/15 hero-gradient text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 md:grid-cols-4 mb-8 md:gap-12 lg:gap-16">
            <div className="space-y-3">
              <LocaleLink href="/" className="flex items-center gap-3 group">
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white/20">
                  <Image
                    src="/icons/light_58x58.png"
                    alt={tImages("logoAlt")}
                    width={32}
                    height={32}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-white/90">{t("siteName")}</div>
              </LocaleLink>
              <div className="pt-2">
                <CircleCropTypewriter />
              </div>
              <div className="flex items-center gap-2 pt-2">
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
                {productLinks.map((link) => {
                  const label =
                    link.href === "/circlecrop"
                      ? t("header.circleCrop")
                      : link.href === "/roundedcorners"
                        ? t("header.roundedCorners")
                        : "label" in link
                          ? link.label
                          : "";
                  return link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-4 hover:text-white hover:underline break-words"
                    >
                      {label}
                    </a>
                  ) : (
                    <LocaleLink
                      key={link.href}
                      href={link.href}
                      className="underline-offset-4 hover:text-white hover:underline break-words"
                    >
                      {label}
                    </LocaleLink>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("footer.legal.title")}</div>
              <div className="flex flex-col gap-2 text-sm text-white/95">
                <LocaleLink
                  href="/legal/privacy"
                  className="underline-offset-4 hover:text-white hover:underline"
                >
                  {t("footer.legal.privacy")}
                </LocaleLink>
                <LocaleLink
                  href="/legal/terms"
                  className="underline-offset-4 hover:text-white hover:underline"
                >
                  {t("footer.legal.terms")}
                </LocaleLink>
                <LocaleLink
                  href="/legal/cookie"
                  className="underline-offset-4 hover:text-white hover:underline"
                >
                  {t("footer.legal.cookie")}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
        {/* Badge row: centered, full-width, between content and bottom border */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 px-6 py-4 lg:px-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://fwfw.app/item/photo-to-url"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://fwfw.app/badge-white.svg"
                width={250}
                height={54}
                alt="Featured on FWFW"
                className="h-6 w-auto shrink-0"
              />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://wired.business"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://wired.business/badge3-dark.svg"
                alt="Featured on Wired Business"
                width={200}
                height={54}
                className="h-6 w-auto shrink-0"
              />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* AI Agents Directory - Photo To URL agent badge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://aiagentsdirectory.com/agent/photo-to-url?utm_source=badge&utm_medium=referral&utm_campaign=free_listing&utm_content=photo-to-url"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
                alt="Photo To URL - Featured AI Agent on AI Agents Directory"
                width={200}
                height={50}
                className="h-6 w-auto shrink-0"
              />
            </a>
            <a
              href="https://aitop10.tools/"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <div className="h-6 px-2 flex items-center justify-center rounded bg-black text-white text-[10px] font-medium whitespace-nowrap shrink-0 leading-none">
                AiTop10 Tools Directory
              </div>
            </a>
            <a
              href="https://dayslaunch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <div className="h-6 px-2 flex items-center justify-center rounded bg-slate-800 text-white text-[10px] font-medium whitespace-nowrap shrink-0 leading-none">
                Days Launch
              </div>
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://www.toolpilot.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://www.toolpilot.ai/cdn/shop/files/f-w_690x151_crop_center.png"
                alt="Featured on Toolpilot"
                width={120}
                height={28}
                className="h-6 w-auto shrink-0"
              />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://toolsfine.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://toolsfine.com/wp-content/uploads/2023/08/Toolsfine-logo-day-0531-80x320-1.webp"
                alt="Featured on ToolsFine.com"
                width={80}
                height={24}
                className="h-6 w-auto shrink-0"
              />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://dang.ai/"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
                alt="Dang.ai"
                width={150}
                height={54}
                className="h-6 w-auto shrink-0"
              />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://fwfw.app/item/photo-to-circle-crop"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://fwfw.app/badge-black.svg"
                width={250}
                height={54}
                alt="Featured on FWFW"
                className="h-6 w-auto shrink-0"
              />
            </a>
          </div>
      </div>
      <div className="border-t border-white/15 hero-gradient text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-4 text-xs lg:px-10">
          <span className="text-white/90 text-center">{t("footer.copyright").replace("2025", new Date().getFullYear().toString())}</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

