"use client";

import { LocaleLink } from "@/i18n/navigation";
import type { ReactNode } from "react";

interface HomeLinkProps {
  children: ReactNode;
  className?: string;
}

/**
 * 客户端组件：确保导航链接能正确保持当前语言环境
 * LocaleLink 会自动从 NextIntlClientProvider 中获取当前的 locale
 */
export function HomeLink({ children, className }: HomeLinkProps) {
  return (
    <LocaleLink href="/" className={className}>
      {children}
    </LocaleLink>
  );
}

