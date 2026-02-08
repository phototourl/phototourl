import Image from "next/image";
import { HeaderNavWithHistory } from "./HeaderNavWithHistory";
import { HeaderRight } from "./HeaderRight";
import { HomeLink } from "./HomeLink";
import { getTranslations } from "next-intl/server";

type SiteHeaderProps = { locale: string };

export async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations({ locale, namespace: "common" });
  const tImages = await getTranslations({ locale, namespace: "images" });
  return (
    <header className="ez-shadow-nav fixed top-0 z-40 w-full border-b border-slate-100 bg-white text-slate-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5 md:gap-4 lg:gap-6">
        {/* Logo + Site Name */}
        <HomeLink className="group flex shrink-0 items-center gap-1">
          <div className="relative h-7 w-7 overflow-hidden rounded-xl transition-all duration-300 group-hover:rotate-6 group-hover:opacity-80 sm:h-10 sm:w-10">
            <Image
              src="/icons/light_logo.png"
              alt={tImages("logoAlt")}
              width={58}
              height={58}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap sm:text-lg">
            {t("siteName")}
          </span>
        </HomeLink>

        {/* Navigation Menu */}
        <HeaderNavWithHistory />

        {/* Right Side: History + Language Switcher */}
        <HeaderRight />
      </div>
    </header>
  );
}

export default SiteHeader;

