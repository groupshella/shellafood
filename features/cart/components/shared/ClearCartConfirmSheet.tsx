"use client";

import { useEffect, useRef } from "react";

interface ClearCartConfirmSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isClearing?: boolean;
  isArabic: boolean;
}

export function ClearCartConfirmSheet({
  isOpen,
  onConfirm,
  onCancel,
  isClearing = false,
  isArabic,
}: ClearCartConfirmSheetProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      cancelButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isClearing) onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClearing, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={isClearing ? undefined : onCancel}
        aria-label={isArabic ? "إغلاق" : "Close"}
        disabled={isClearing}
      />

      {/* Mobile: bottom sheet · Desktop: centered modal */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:items-center md:p-6 lg:p-8">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="clear-cart-title"
          dir={isArabic ? "rtl" : "ltr"}
          lang={isArabic ? "ar" : "en"}
          className={[
            "pointer-events-auto w-full max-w-lg rounded-t-3xl bg-background px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl",
            "sm:px-5",
            "md:max-w-md md:rounded-2xl md:pb-6 md:pt-5 md:shadow-xl",
          ].join(" ")}
        >
          <div
            className="mx-auto mb-5 h-1 w-10 rounded-full bg-border md:hidden"
            aria-hidden
          />

          <p
            id="clear-cart-title"
            className="mb-6 text-center text-base font-semibold text-foreground sm:text-lg"
          >
            {isArabic ? "هل ترغب في تفريغ السلة؟" : "Do you want to clear the cart?"}
          </p>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isClearing}
            className="mb-3 w-full rounded-2xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:brightness-90 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-[15px] md:hover:brightness-95"
          >
            {isClearing
              ? isArabic
                ? "جاري التفريغ..."
                : "Clearing..."
              : isArabic
                ? "تفريغ السلة"
                : "Clear cart"}
          </button>

          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isClearing}
            className="w-full rounded-2xl bg-card py-3.5 text-sm font-medium text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border active:brightness-90 disabled:opacity-60 sm:py-4 sm:text-[15px] md:hover:brightness-95"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
