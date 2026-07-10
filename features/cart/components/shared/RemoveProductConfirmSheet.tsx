"use client";

import { useEffect, useRef } from "react";

interface RemoveProductConfirmSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isRemoving?: boolean;
}

const SHEET_LAYOUT =
  "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl dark:bg-gray-900 sm:max-w-2xl sm:px-5 md:max-w-xl lg:max-w-2xl";

export function RemoveProductConfirmSheet({
  isOpen,
  onConfirm,
  onCancel,
  isRemoving = false,
}: RemoveProductConfirmSheetProps) {
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
      if (e.key === "Escape" && !isRemoving) onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isRemoving, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-black/50 backdrop-blur-[2px] transition-opacity dark:bg-black/70"
        onClick={isRemoving ? undefined : onCancel}
        aria-label="إغلاق"
        disabled={isRemoving}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-product-title"
        className={SHEET_LAYOUT}
        dir="rtl"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden />

        <p
          id="remove-product-title"
          className="mb-6 text-center text-base font-bold text-red-500 dark:text-red-400 sm:text-lg"
        >
          هل متأكد من حذف المنتج؟
        </p>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isRemoving}
          className="mb-3 w-full rounded-2xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-900 sm:py-4 sm:text-[15px]"
        >
          {isRemoving ? "جاري الحذف..." : "حذف"}
        </button>

        <button
          ref={cancelButtonRef}
          type="button"
          onClick={onCancel}
          disabled={isRemoving}
          className="w-full rounded-2xl bg-gray-100 py-3.5 text-sm font-medium text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 active:bg-gray-200 disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:focus-visible:ring-gray-500 dark:active:bg-gray-700 sm:py-4 sm:text-[15px]"
        >
          إلغاء
        </button>
      </div>
    </>
  );
}
