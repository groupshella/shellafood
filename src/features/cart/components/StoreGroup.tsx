'use client';

/**
 * StoreGroup — renders one store's header + its item rows
 * Pure UI: receives items and callbacks, owns nothing
 */
import React from 'react';
import { Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItemRow } from './CartItemRow';
import type { CartItem } from '../types/cart.types';

interface StoreGroupProps {
  storeName: string;
  items: CartItem[];
  isArabic: boolean;
  isUpdating: boolean;
  onIncrease: (cartId: string, priceAtAdd: number, qty: number) => void;
  onDecrease: (cartId: string, priceAtAdd: number, qty: number) => void;
  onRemove: (cartId: string) => void;
}

export function StoreGroup({
  storeName,
  items,
  isArabic,
  isUpdating,
  onIncrease,
  onDecrease,
  onRemove,
}: StoreGroupProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-1 border border-gray-100 dark:border-gray-700/60">
      {/* Store header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 `}>
        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
          <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">
          {storeName}
        </span>
        <span className={`text-xs text-gray-400 dark:text-gray-500 ${isArabic ? 'mr-auto' : 'ml-auto'} flex-shrink-0`}>
          {items.length} {isArabic ? (items.length === 1 ? 'منتج' : 'منتجات') : (items.length === 1 ? 'item' : 'items')}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-2 p-1">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isArabic={isArabic}
              isUpdating={isUpdating}
              onIncrease={() => onIncrease(item.id, item.priceAtAdd, item.quantity + 1)}
              onDecrease={() => onDecrease(item.id, item.priceAtAdd, item.quantity - 1)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
