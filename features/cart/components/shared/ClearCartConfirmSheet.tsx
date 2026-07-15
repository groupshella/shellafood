"use client";

import { useEffect, useRef } from "react";

interface ClearCartConfirmSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isClearing?: boolean;
}

export function ClearCartConfirmSheet({
  isOpen,
  onConfirm,
  onCancel,
  isClearing = false,
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
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px] transition-opacity dark:bg-black/70"
        onClick={isClearing ? undefined : onCancel}
        aria-label="إغلاق"
        disabled={isClearing}
      />

      {/* Mobile: bottom sheet · Desktop: centered modal */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:items-center md:p-6 lg:p-8">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="clear-cart-title"
          className={[
            "pointer-events-auto w-full max-w-lg rounded-t-3xl bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl",
            "dark:bg-gray-900 sm:px-5",
            "md:max-w-md md:rounded-2xl md:pb-6 md:pt-5 md:shadow-xl",
          ].join(" ")}
          dir="rtl"
        >
          <div
            className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700 md:hidden"
            aria-hidden
          />

          <p
            id="clear-cart-title"
            className="mb-6 text-center text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg"
          >
            هل ترغب في تفريغ السلة؟
          </p>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isClearing}
            className="mb-3 w-full rounded-2xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-900 sm:py-4 sm:text-[15px] md:hover:bg-[#267332]"
          >
            {isClearing ? "جاري التفريغ..." : "تفريغ السلة"}
          </button>

          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isClearing}
            className="w-full rounded-2xl bg-gray-100 py-3.5 text-sm font-medium text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 active:bg-gray-200 disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:focus-visible:ring-gray-500 dark:active:bg-gray-700 sm:py-4 sm:text-[15px] md:hover:bg-gray-200 dark:md:hover:bg-gray-700"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
