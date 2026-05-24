'use client';

/**
 * ClearCartModal — confirms before wiping the cart
 * Pure UI.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Loader2 } from 'lucide-react';

interface ClearCartModalProps {
  isOpen: boolean;
  isArabic: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClearCartModal({
  isOpen, isArabic, isLoading, onConfirm, onCancel,
}: ClearCartModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!isLoading ? onCancel : undefined}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22 }}
            className={`fixed z-50 inset-x-4 bottom-6 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 ${isArabic ? 'text-right' : 'text-left'
              }`}
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-500 dark:text-red-400" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-center text-gray-900 dark:text-gray-100 mb-1">
              {isArabic ? 'مسح السلة' : 'Clear Cart'}
            </h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">
              {isArabic
                ? 'سيتم حذف جميع المنتجات من سلتك. هل أنت متأكد؟'
                : 'All items will be removed from your cart. Are you sure?'}
            </p>

            <div className={`flex gap-3 `}>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <motion.button
                type="button"
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-sm font-bold shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isArabic ? 'جاري...' : 'Clearing…'}</span>
                  </>
                ) : (
                  isArabic ? 'مسح الكل' : 'Clear All'
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
