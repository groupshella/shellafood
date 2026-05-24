'use client';

/**
 * OrderSummary — price breakdown + checkout button
 * Pure UI. Sticky on desktop, collapsible on mobile.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Truck, Sparkles, TrendingDown, Shield } from 'lucide-react';

const SERVICE_FEE_PCT = 2; // keep in sync with cart.constants

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderSummaryProps {
  isArabic: boolean;
  subtotal: number;
  deliveryFee: number;
  serviceFee?: number;
  discount?: number;
  couponDiscount?: number;
  total: number;
  isLoading?: boolean;
  canCheckout?: boolean;
  estimatedTime?: string;
  freeDeliveryThreshold?: number;
  onCheckout: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, isArabic: boolean) {
  return `${n.toFixed(2)} ${isArabic ? 'ريال' : 'SAR'}`;
}

function Row({
  label, value, valueClass = 'font-semibold text-gray-900 dark:text-gray-100', icon,
}: { label: React.ReactNode; value: string; valueClass?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
        {icon}{label}
      </span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

// ─── Breakdown (always visible on ≥lg, toggleable on mobile) ─────────────────

function Breakdown({
  isArabic, subtotal, deliveryFee, serviceFee = 0,
  discount = 0, couponDiscount = 0, total,
  estimatedTime, freeDeliveryThreshold = 100,
}: OrderSummaryProps) {
  const totalDiscount = discount + couponDiscount;
  const savings = totalDiscount;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);
  const progress = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="space-y-2.5 pb-5 mb-5 border-b border-gray-100 dark:border-gray-700">
        {/* Subtotal */}
        <Row
          label={isArabic ? 'المجموع الفرعي' : 'Subtotal'}
          value={fmt(subtotal, isArabic)}
        />

        {/* Service fee */}
        {serviceFee > 0 && (
          <Row
            label={isArabic ? `رسوم الخدمة (${SERVICE_FEE_PCT}%)` : `Service Fee (${SERVICE_FEE_PCT}%)`}
            value={fmt(serviceFee, isArabic)}
          />
        )}

        {/* Delivery fee */}
        {deliveryFee > 0 ? (
          <Row
            label={isArabic ? 'رسوم التوصيل' : 'Delivery Fee'}
            value={fmt(deliveryFee, isArabic)}
            icon={<Truck className="w-3.5 h-3.5" />}
          />
        ) : (
          <Row
            label={isArabic ? 'التوصيل' : 'Delivery'}
            value={isArabic ? 'مجاني 🎉' : 'Free 🎉'}
            valueClass="font-semibold text-emerald-600 dark:text-emerald-400"
            icon={<Truck className="w-3.5 h-3.5" />}
          />
        )}

        {/* Free delivery progress bar */}
        {subtotal < freeDeliveryThreshold && (
          <div className="pt-1">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1.5 font-medium">
              {isArabic
                ? `أضف ${fmt(amountNeeded, isArabic)} للتوصيل المجاني`
                : `Add ${fmt(amountNeeded, isArabic)} for free delivery`}
            </p>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Discount */}
        {totalDiscount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              {isArabic ? 'الخصم' : 'Discount'}
              {couponDiscount > 0 && (
                <span className="text-[10px] opacity-70">({isArabic ? 'كوبون' : 'coupon'})</span>
              )}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              -{fmt(totalDiscount, isArabic)}
            </span>
          </motion.div>
        )}

        {/* Savings callout */}
        {savings > 0 && (
          <div className="flex items-center gap-1.5 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            {isArabic ? `وفّرت ${fmt(savings, isArabic)} 🎉` : `You're saving ${fmt(savings, isArabic)} 🎉`}
          </div>
        )}

        {/* Estimated delivery time */}
        {estimatedTime && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 pt-1">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            {isArabic ? `وقت التوصيل المتوقع: ${estimatedTime}` : `Estimated delivery: ${estimatedTime}`}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-base font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? 'الإجمالي' : 'Total'}
        </span>
        <motion.span
          key={total}
          initial={{ scale: 1.15, color: '#10b981' }}
          animate={{ scale: 1, color: '#10b981' }}
          transition={{ duration: 0.25 }}
          className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400"
        >
          {fmt(total, isArabic)}
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function OrderSummary(props: OrderSummaryProps) {
  const { isArabic, isLoading = false, canCheckout = true, onCheckout } = props;

  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const showBreakdown = isDesktop || expanded;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 lg:sticky lg:top-6">
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 `}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? 'ملخص الطلب' : 'Order Summary'}
        </h3>
        {/* Toggle — mobile only */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded
            ? <ChevronUp className="w-5 h-5" />
            : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Breakdown — animated */}
      <AnimatePresence initial={false}>
        {showBreakdown && <Breakdown key="breakdown" {...props} />}
      </AnimatePresence>

      {/* Mobile total (always visible) */}
      {!showBreakdown && (
        <div className={`flex items-center justify-between mb-5 `}>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isArabic ? 'الإجمالي' : 'Total'}
          </span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {fmt(props.total, isArabic)}
          </span>
        </div>
      )}

      {/* Checkout button */}
      <motion.button
        type="button"
        whileHover={canCheckout && !isLoading ? { scale: 1.02, boxShadow: '0 10px 28px rgba(16,185,129,0.28)' } : {}}
        whileTap={canCheckout && !isLoading ? { scale: 0.98 } : {}}
        onClick={onCheckout}
        disabled={!canCheckout || isLoading}
        className={`w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-base transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 
          }`}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            <span>{isArabic ? 'جاري المعالجة...' : 'Processing…'}</span>
          </>
        ) : (
          <>
            <span>{isArabic ? 'تأكيد الطلب' : 'Confirm & Checkout'}</span>
            <motion.span
              animate={{ x: [0, isArabic ? -4 : 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isArabic ? '←' : '→'}
            </motion.span>
          </>
        )}
      </motion.button>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Shield className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {isArabic ? '🔒 معالجة آمنة ومشفرة لبياناتك' : '🔒 Secure encrypted processing'}
        </p>
      </div>
    </div>
  );
}
