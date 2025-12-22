"use client";

import Image from "next/image";
import { HomeLink } from "./HomeLink";
import { useTranslations } from "next-intl";

export function PhotoToUrlLink() {
  const t = useTranslations("common");
  
  return (
    <HomeLink className="flex items-center gap-3 group pointer-events-auto">
      <div className="h-12 w-12 rounded-2xl overflow-hidden group-hover:scale-110 group-hover:rotate-12 transition-all duration-200 will-change-transform">
        <Image
          src="/icons/light_58x58.png"
          alt={t("siteName")}
          width={48}
          height={48}
          className="h-full w-full object-contain"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      <span className="text-2xl font-bold text-brand-teal group-hover:underline underline-offset-8 transition-all duration-200">
        {t("siteName")}
      </span>
    </HomeLink>
  );
}

