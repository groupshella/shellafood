"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { ClearCartConfirmSheet } from "@/features/cart/components/shared/ClearCartConfirmSheet";
import { useNotification } from "@/shared/components/NotificationToast";

interface CartShellProps {
  title: string;
  isArabic: boolean;
  children: React.ReactNode;
}

const SHELL_LAYOUT = [
  "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-background",
  "sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl",
].join(" ");

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";

export function CartShell({ title, isArabic, children }: CartShellProps) {
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
      success(isArabic ? "تم تفريغ السلة" : "Cart cleared");
    } else {
      notifyError(
        result.message ??
          (isArabic ? "تعذّر تفريغ السلة" : "Could not clear the cart"),
      );
    }
    setIsClearing(false);
  }, [clearAllProducts, isArabic, notifyError, success]);

  const hasItems = totalCount > 0;
  const BackIcon = isArabic ? ChevronRight : ChevronLeft;

  return (
    <div
      className={SHELL_LAYOUT}
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
    >
      <header
        className={[
          "sticky top-0 z-10 flex items-center justify-between",
          "border-b border-border bg-background/95 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md",
          HEADER_PADDING,
        ].join(" ")}
      >
        <Link
          href="/home"
          className={[
            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            "active:bg-card sm:h-11 sm:w-11",
            "md:hover:bg-card",
            hasItems ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-label={isArabic ? "رجوع" : "Back"}
          tabIndex={hasItems ? 0 : -1}
        >
          <BackIcon className="h-5 w-5 text-foreground sm:h-[22px] sm:w-[22px]" aria-hidden />
        </Link>

        <h1 className="pointer-events-none absolute inset-x-0 text-center text-base font-bold text-foreground sm:text-lg lg:text-xl">
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
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              "active:bg-red-50 disabled:opacity-50",
              "md:hover:bg-red-50",
              "sm:px-2.5 sm:text-sm",
            ].join(" ")}
          >
            {isArabic ? "أفرغ السلة" : "Clear cart"}
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <ClearCartConfirmSheet
        isOpen={showClearConfirm}
        onConfirm={handleClearCart}
        onCancel={handleCancelClear}
        isClearing={isClearing}
        isArabic={isArabic}
      />
    </div>
  );
}
