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
      <div className="h-12 w-12 rounded-2xl overflow-hidden group-hover:scale-110 group-hover:rotate-12 transition-all duration-200 will-change-transform">
        <Image
          src="/circle-crop-favicon.png"
          alt={t("title")}
          width={48}
          height={48}
          className="h-full w-full object-contain"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      <span className="text-2xl font-bold text-brand-teal group-hover:underline underline-offset-8 transition-all duration-200">
        {t("title")}
      </span>
    </LocaleLink>
  );
}

