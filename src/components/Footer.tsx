import Link from "next/link";
import React from "react";
import MutedText from "./Wrapped/MutedText";

function Footer() {
  return (
<div className="flex justify-between items-center text-xs mt-6 mb-3 px-6"> {/* 增加内边距 */}
  <div className="pt-4">
    <MutedText>© Copyright 2024. All rights reserved.  </MutedText>
  </div>
  <div className="flex space-x-4 pt-4">
    <Link href="/legal/terms" className="text-zinc-1000 font-medium">
      Terms of Service
    </Link>
    <Link href="/legal/privacy" className="text-zinc-800 font-medium">
      Privacy Policy
    </Link>
    <Link href="/legal/impressum" className="text-zinc-800 font-medium">
      Impressum
    </Link>
  </div>
</div>


  );
}

export default Footer;
