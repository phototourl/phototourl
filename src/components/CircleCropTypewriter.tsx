"use client";

import Image from "next/image";
import { LocaleLink } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function CircleCropTypewriter() {
  const t = useTranslations("circleCrop");
  return (
    <LocaleLink
      href="/circlecrop"
      className="flex items-center gap-3 group pointer-events-auto"
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-md bg-white/10">
        <Image
          src="/circle-crop-favicon.png"
          alt={t("title")}
          width={32}
          height={32}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="text-xl font-semibold text-white">
        {t("title")}
      </div>
    </LocaleLink>
  );
}

