'use client';

/**
 * EmptyCart — shown when cart is empty
 * Pure UI.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface EmptyCartProps {
  isArabic: boolean;
  onShop: () => void;
}

export function EmptyCart({ isArabic, onShop }: EmptyCartProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-28 h-28 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6"
      >
        <ShoppingCart className="w-14 h-14 text-emerald-400 dark:text-emerald-500" strokeWidth={1.5} />
      </motion.div>

      <motion.h2
        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
      >
        {isArabic ? 'سلتك فارغة' : 'Your cart is empty'}
      </motion.h2>

      <motion.p
        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xs"
      >
        {isArabic
          ? 'يبدو أنك لم تضف أي منتجات بعد. ابدأ التسوق الآن!'
          : "Looks like you haven't added anything yet. Start shopping now!"}
      </motion.p>

      <motion.button
        type="button"
        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={onShop}
        className={`flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-colors 
        }`}
      >
        <span>{isArabic ? 'تسوق الآن' : 'Shop Now'}</span>
        <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  );
}
