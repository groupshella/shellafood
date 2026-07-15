"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { ClearCartConfirmSheet } from "@/features/cart/components/shared/ClearCartConfirmSheet";
import { useNotification } from "@/shared/components/NotificationToast";
import { MODULE_PAGE_BG } from "@/shared/lib/page-surface";

interface CartShellProps {
  title: string;
  children: React.ReactNode;
}

const SHELL_LAYOUT = [
  "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden",
  "sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl",
  MODULE_PAGE_BG,
].join(" ");

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";

export function CartShell({ title, children }: CartShellProps) {
  const { clearAllProducts, totalCount } = useCart();
  const { success, error: notifyError } = useNotification();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleOpenClear = useCallback(() => {
    setShowClearConfirm(true);
  }, []);

  const handleCancelClear = useCallback(() => {
    setShowClearConfirm(false);
  }, []);

  const handleClearCart = useCallback(async () => {
    setShowClearConfirm(false);
    setIsClearing(true);
    const result = await clearAllProducts();
    if (result.success) {
      success("تم تفريغ السلة");
    } else {
      notifyError(result.message ?? "تعذّر تفريغ السلة");
    }
    setIsClearing(false);
  }, [clearAllProducts, notifyError, success]);

  const hasItems = totalCount > 0;

  return (
    <div className={SHELL_LAYOUT} dir="rtl">
      <header
        className={[
          "sticky top-0 z-10 flex items-center justify-between",
          "bg-white/95 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md",
          "dark:bg-gray-900/95 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]",
          HEADER_PADDING,
        ].join(" ")}
      >
        <Link
          href="/home"
          className={[
            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]",
            "active:bg-gray-100 dark:active:bg-gray-800 sm:h-11 sm:w-11",
            "md:hover:bg-gray-100 dark:md:hover:bg-gray-800",
            hasItems ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-label="رجوع"
          tabIndex={hasItems ? 0 : -1}
        >
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300 sm:h-[22px] sm:w-[22px]" aria-hidden />
        </Link>

        <h1 className="pointer-events-none absolute inset-x-0 text-center text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">
          {title}
        </h1>

        <div
          className={[
            "relative z-10 min-w-[4.5rem] transition-opacity sm:min-w-[5.5rem]",
            hasItems ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={handleOpenClear}
            disabled={isClearing || !hasItems}
            tabIndex={hasItems ? 0 : -1}
            className={[
              "flex min-h-10 items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold text-red-500",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1",
              "active:bg-red-50 disabled:opacity-50",
              "dark:text-red-400 dark:focus-visible:ring-offset-gray-900 dark:active:bg-red-950/40",
              "md:hover:bg-red-50 dark:md:hover:bg-red-950/30",
              "sm:px-2.5 sm:text-sm",
            ].join(" ")}
          >
            أفرغ السلة
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <ClearCartConfirmSheet
        isOpen={showClearConfirm}
        onConfirm={handleClearCart}
        onCancel={handleCancelClear}
        isClearing={isClearing}
      />
    </div>
  );
}
