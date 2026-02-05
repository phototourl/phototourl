"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export function ScrollButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => setDrawerOpen((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener("upload-history-drawer-change", handler);
    return () => window.removeEventListener("upload-history-drawer-change", handler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => setModalOpen((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener("language-modal-change", handler);
    return () => window.removeEventListener("language-modal-change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 向下箭头：未滚动超过一屏时显示
      const scrollThreshold = window.innerHeight;
      setShowScrollDown(scrollY < scrollThreshold);
      // 向上箭头：只要不在顶部就显示（短页面也能看到），阈值 80px
      setShowBackToTop(scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (targetPosition: number) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // 1.5秒
    let start: number | null = null;

    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollToNext = () => {
    smoothScrollTo(document.documentElement.scrollHeight);
  };

  const scrollToTop = () => {
    smoothScrollTo(0);
  };

  if (drawerOpen || modalOpen) return null;

  return (
    <>
      {/* Scroll down button - 显示在首屏 */}
      {showScrollDown && (
        <button
          onClick={scrollToNext}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      )}

      {/* Back to top button - 滚动后显示 */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  );
}

