import Image from "next/image";
import { HeaderNavWithHistory } from "./HeaderNavWithHistory";
import { HomeLink } from "./HomeLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getTranslations } from "next-intl/server";

export async function SiteHeader() {
  const t = await getTranslations("common");
  const tImages = await getTranslations("images");
  return (
    <header className="ez-shadow-nav fixed top-0 z-40 w-full border-b border-slate-100 bg-white text-slate-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-3">
          <HomeLink className="group flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-xl transition-all duration-300 group-hover:rotate-6 group-hover:opacity-80 sm:h-10 sm:w-10">
              <Image
                src="/icons/light_58x58.png"
                alt={tImages("logoAlt")}
                width={58}
                height={58}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("siteName")}
            </span>
          </HomeLink>
          <HeaderNavWithHistory />
        </div>
        <LanguageSwitcher variant="header" />
      </div>
    </header>
  );
}

export default SiteHeader;

