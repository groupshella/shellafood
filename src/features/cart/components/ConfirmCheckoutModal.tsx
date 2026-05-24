'use client';

/**
 * ConfirmCheckoutModal — shows order total before final confirm
 * Pure UI.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Loader2 } from 'lucide-react';

interface ConfirmCheckoutModalProps {
  isOpen: boolean;
  isArabic: boolean;
  isProcessing: boolean;
  total: number;
  itemsCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmCheckoutModal({
  isOpen,
  isArabic,
  isProcessing,
  total,
  itemsCount,
  onConfirm,
  onCancel,
}: ConfirmCheckoutModalProps) {
  const currency = isArabic ? 'ريال' : 'SAR';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!isProcessing ? onCancel : undefined}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`fixed z-50 inset-x-4 bottom-6 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 ${isArabic ? 'text-right' : 'text-left'
              }`}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-center text-gray-900 dark:text-gray-100 mb-1">
              {isArabic ? 'تأكيد الطلب' : 'Confirm Order'}
            </h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">
              {isArabic
                ? `${itemsCount} ${itemsCount === 1 ? 'منتج' : 'منتجات'} · الإجمالي ${total.toFixed(2)} ${currency}`
                : `${itemsCount} ${itemsCount === 1 ? 'item' : 'items'} · Total ${total.toFixed(2)} ${currency}`}
            </p>

            {/* Actions */}
            <div className={`flex gap-3`}>
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <motion.button
                type="button"
                whileTap={!isProcessing ? { scale: 0.97 } : {}}
                onClick={onConfirm}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-bold shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isArabic ? 'جاري...' : 'Placing…'}</span>
                  </>
                ) : (
                  isArabic ? 'تأكيد' : 'Confirm'
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
