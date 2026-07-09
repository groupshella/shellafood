"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { ClearCartConfirmSheet } from "@/features/cart/components/shared/ClearCartConfirmSheet";

interface CartShellProps {
  title: string;
  children: React.ReactNode;
}

const SHELL_LAYOUT =
  "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";

export function CartShell({ title, children }: CartShellProps) {
  const router = useRouter();
  const { clearAllProducts, totalCount } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleOpenClear = useCallback(() => {
    setShowClearConfirm(true);
  }, []);

  const handleCancelClear = useCallback(() => {
    setShowClearConfirm(false);
  }, []);

  const handleClearCart = useCallback(async () => {
    setShowClearConfirm(false);
    setIsClearing(true);
    await clearAllProducts();
    setIsClearing(false);
  }, [clearAllProducts]);

  return (
    <div className={SHELL_LAYOUT} dir="rtl">
      <header className={`sticky top-0 z-10 flex items-center justify-between bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] ${HEADER_PADDING}`}>
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] active:bg-gray-100 dark:active:bg-gray-800 sm:h-11 sm:w-11"
          aria-label="رجوع"
        >
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300 sm:h-[22px] sm:w-[22px]" aria-hidden />
        </button>

        <h1 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">{title}</h1>

        <div className={`min-w-[4.5rem] transition-opacity sm:min-w-[5.5rem] ${totalCount > 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <button
            type="button"
            onClick={handleOpenClear}
            disabled={isClearing}
            className="flex min-h-10 items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 active:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:focus-visible:ring-offset-gray-900 dark:active:bg-red-950/40 sm:px-2.5 sm:text-sm"
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
