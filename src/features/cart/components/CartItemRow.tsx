'use client';

/**
 * CartItemRow — one item inside the cart
 * Pure UI: no state, no hooks, all data + callbacks via props
 */
import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CartItem } from '../types/cart.types'

interface CartItemRowProps {
  item: CartItem;
  isArabic: boolean;
  isUpdating: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  isArabic,
  isUpdating,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const currency = isArabic ? 'ريال' : 'SAR';
  const lineTotal = (item.priceAtAdd * item.quantity).toFixed(2);
  const canDecrease = item.quantity > 1;
  const canIncrease = item.quantity < item.stock;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: isArabic ? 60 : -60 }}
      transition={{ duration: 0.22 }}
      className={`flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm 
        }`}
    >
      {/* ── Image ── */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
            {isArabic ? 'لا صورة' : 'No img'}
          </div>
        )}
        {item.hasDiscount && (
          <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {isArabic ? 'خصم' : 'SALE'}
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
          {item.productName}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {item.storeName}
        </p>
        <div className={`flex items-center gap-1.5 mt-1 `}>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {lineTotal} {currency}
          </span>
          {item.quantity > 1 && (
            <span className="text-xs text-gray-400">
              ({item.priceAtAdd.toFixed(2)} × {item.quantity})
            </span>
          )}
        </div>
      </div>

      {/* ── Quantity ── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={onDecrease}
          disabled={isUpdating || !canDecrease}
          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={isArabic ? 'تقليل الكمية' : 'Decrease quantity'}
        >
          <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
        </button>

        <AnimatePresence mode="wait">
          <motion.span
            key={item.quantity}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-7 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums"
          >
            {item.quantity}
          </motion.span>
        </AnimatePresence>

        <button
          type="button"
          onClick={onIncrease}
          disabled={isUpdating || !canIncrease}
          className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={isArabic ? 'زيادة الكمية' : 'Increase quantity'}
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </button>
      </div>

      {/* ── Remove ── */}
      <button
        type="button"
        onClick={onRemove}
        disabled={isUpdating}
        className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors disabled:opacity-40 flex-shrink-0 group"
        aria-label={isArabic ? 'حذف المنتج' : 'Remove item'}
      >
        <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-red-500 dark:text-gray-600 dark:group-hover:text-red-400 transition-colors" />
      </button>
    </motion.div>
  );
}
