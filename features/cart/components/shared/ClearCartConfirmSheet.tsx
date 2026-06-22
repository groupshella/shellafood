"use client";

import { useEffect } from "react";

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
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onCancel}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal
        aria-label="تأكيد تفريغ السلة"
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-xl"
        dir="rtl"
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-gray-200" />

        <p className="mb-6 text-center text-base font-semibold text-gray-900">
          هل ترغب في تفريغ السلة ؟
        </p>

        <button
          onClick={onConfirm}
          disabled={isClearing}
          className="mb-3 w-full rounded-2xl bg-[#30913F] py-4 text-sm font-semibold text-white transition-colors active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isClearing ? "جاري التفريغ..." : "تفريغ السلة"}
        </button>

        <button
          onClick={onCancel}
          disabled={isClearing}
          className="w-full rounded-2xl bg-gray-100 py-4 text-sm font-medium text-gray-700 transition-colors active:bg-gray-200 disabled:opacity-60"
        >
          إلغاء
        </button>
      </div>
    </>
  );
}
