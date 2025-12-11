import Image from "next/image";
import Link from "next/link";
import logo from "@/image/photologo.png";

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-[#0b3a5c] bg-[#0b3a5c] text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/20 bg-white shadow-sm">
            <Image
              src={logo}
              alt="Photo to URL logo"
              fill
              sizes="40px"
              className="object-contain p-1.5"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-white">
              Photo to URL
            </span>
            <span className="text-xs text-white/80">
              Turn images into shareable links
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default SiteHeader;

