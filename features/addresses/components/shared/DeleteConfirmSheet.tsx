"use client";

import { useEffect } from "react";

interface DeleteConfirmSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmSheet({
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmSheetProps) {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onCancel}
        aria-hidden
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal
        aria-label="تأكيد حذف العنوان"
        className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-xl"
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />

        {/* Question */}
        <p className="text-base font-semibold text-gray-900 text-center mb-6">
          هل ترغب في حذف العنوان ؟
        </p>

        {/* Confirm delete */}
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="
            w-full bg-[#30913F] text-white text-sm font-semibold
            rounded-2xl py-4 mb-3
            active:bg-[#267332] transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isDeleting ? "جاري الحذف..." : "حذف العنوان"}
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="
            w-full bg-gray-100 text-gray-700 text-sm font-medium
            rounded-2xl py-4
            active:bg-gray-200 transition-colors
            disabled:opacity-60
          "
        >
          إلغاء
        </button>
      </div>
    </>
  );
}
