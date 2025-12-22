"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface RateServiceSectionProps {
  translationKey?: string; // 默认为 "home.rateService"，可以传入 "circleCrop.rateService"
}

export function RateServiceSection({ translationKey = "home.rateService" }: RateServiceSectionProps) {
  const t = useTranslations(translationKey);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  return (
    <section className="py-16 section-bg-yellow">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">{t("title")}</h3>
          
          {/* Thank You Message */}
          {showThankYou && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 text-green-600 font-medium"
            >
              <Check className="h-5 w-5" />
              <span>{t("thankYou")}</span>
            </motion.div>
          )}
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const displayRating = hoveredStar || selectedRating;
              const filledStars = displayRating ? Math.floor(displayRating) : 0;
              
              return (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => {
                    setSelectedRating(star);
                    setShowThankYou(true);
                    // 模拟提交评分（实际应用中会调用API）
                    setTimeout(() => {
                      setSelectedRating(null);
                      setShowThankYou(false);
                    }, 4000);
                  }}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      displayRating && star <= filledStars
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-slate-300"
                    )}
                    strokeWidth={displayRating && star <= filledStars ? 0 : 1.5}
                  />
                </button>
              );
            })}
          </div>
          <div className="border-t border-slate-200 pt-4">
            <div className="text-3xl font-bold text-slate-800">
              <span className="font-extrabold">{t("averageRating")}</span>
            </div>
            <div className="text-sm text-slate-500 mt-2">{t("votes")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

