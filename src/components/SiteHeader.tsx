import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocaleLink } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function SiteHeader() {
  const t = await getTranslations("common");
  return (
    <header className="ez-shadow-nav fixed top-0 z-40 w-full border-b border-slate-100 bg-white text-slate-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6 sm:h-16">
        <LocaleLink href="/" className="group flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-md transition-transform duration-200 group-hover:scale-105 sm:h-[55px] sm:w-[55px]">
            <Image
              src="/icons/light_58x58.png"
              alt="Photo to URL logo"
              width={58}
              height={58}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("siteName")}
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              {t("header.subtitle")}
            </span>
          </div>
        </LocaleLink>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;

