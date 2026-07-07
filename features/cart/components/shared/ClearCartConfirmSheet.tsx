"use client";

import { useEffect } from "react";

interface ClearCartConfirmSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isClearing?: boolean;
}

const SHEET_LAYOUT =
  "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl dark:bg-gray-900 sm:max-w-2xl sm:px-5 md:max-w-xl lg:max-w-2xl";

export function ClearCartConfirmSheet({
  isOpen,
  onConfirm,
  onCancel,
  isClearing = false,
}: ClearCartConfirmSheetProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity dark:bg-black/70"
        onClick={onCancel}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal
        aria-label="تأكيد تفريغ السلة"
        className={SHEET_LAYOUT}
        dir="rtl"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />

        <p className="mb-6 text-center text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg">
          هل ترغب في تفريغ السلة؟
        </p>

        <button
          onClick={onConfirm}
          disabled={isClearing}
          className="mb-3 w-full rounded-2xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-[15px]"
        >
          {isClearing ? "جاري التفريغ..." : "تفريغ السلة"}
        </button>

        <button
          onClick={onCancel}
          disabled={isClearing}
          className="w-full rounded-2xl bg-gray-100 py-3.5 text-sm font-medium text-gray-700 transition-colors active:bg-gray-200 disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:py-4 sm:text-[15px]"
        >
          إلغاء
        </button>
      </div>
    </>
  );
}
