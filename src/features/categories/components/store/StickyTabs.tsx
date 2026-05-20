"use client";

import { useLanguage } from "@/providers";
import { motion } from "framer-motion";
import { memo } from "react";

interface StickyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; labelAr: string }[];
}

function StickyTabs({ activeTab, onTabChange, tabs }: StickyTabsProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="sticky top-16 z-40 backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid rgba(16,185,129,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* dark mode layer */}
      <div className="dark:hidden" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="flex gap-0 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex-shrink-0 px-5 sm:px-7 py-4 text-sm font-semibold transition-colors duration-200 focus:outline-none"
                style={{
                  color: isActive
                    ? "#059669"
                    : "rgba(107,114,128,1)",
                }}
              >
                {isArabic ? tab.labelAr : tab.label}

                {/* animated underline */}
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t-full"
                    style={{ background: "linear-gradient(90deg,#059669,#10b981)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dark mode override — same component, different colors */}
      <style>{`
        .dark [data-sticky-tabs] {
          background: rgba(17,24,39,0.92) !important;
          border-bottom-color: rgba(16,185,129,0.1) !important;
        }
        .dark [data-sticky-tabs] button {
          color: rgba(156,163,175,1);
        }
        .dark [data-sticky-tabs] button[data-active="true"] {
          color: #34d399;
        }
      `}</style>
    </div>
  );
}

export default memo(StickyTabs);