"use client";

import Image from "next/image";
import { LocaleLink } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function CircleCropTypewriter() {
  const t = useTranslations("common");
  const label = t("header.circleCrop");
  return (
    <LocaleLink
      href="/circle-crop"
      className="flex items-center gap-3 group pointer-events-auto"
    >
      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white/20">
        <Image
          src="/circle-crop-favicon.png"
          alt={label}
          width={32}
          height={32}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-white/90 whitespace-nowrap">
        {label}
      </div>
    </LocaleLink>
  );
}

