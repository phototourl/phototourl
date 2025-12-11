import Image from "next/image";
import Link from "next/link";
import logo from "@/image/logo.png";

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-40 w-full bg-gradient-to-r from-[#0b3a5c] via-[#0b4f73] to-[#0b3a5c] text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-10 px-6 py-4">
        <Link href="/" className="group flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Image
              src={logo}
              alt="Photo to URL logo"
              fill
              sizes="56px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-semibold text-white">
              Photo to URL
            </span>
            <span className="text-base text-white/80">
              Turn images into shareable links
            </span>
          </div>
        </Link>
        <div className="hidden text-right text-sm font-semibold text-white/85 md:block">
          Drop, paste, or upload — get a shareable link instantly
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;

