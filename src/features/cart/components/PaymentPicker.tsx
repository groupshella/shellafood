'use client';

/**
 * PaymentPicker — all payment UI in one component
 * Pure UI: zero state, zero fetching — all via props
 *
 * Detail panels:
 *   cash       → info banner
 *   wallet     → balance row + insufficient warning
 *   kaidha     → qidha balance summary
 *   myfatoorah → redirect notice
 *   offline    → sub-method list + dynamic fields + note
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote, Wallet, CreditCard, Receipt,
  Check, Lock, Loader2, Info, AlertCircle, ExternalLink,
} from 'lucide-react';
import type { PaymentMethod } from '../types/cart.types';

// ─── Public types (used by CartPage) ─────────────────────────────────────────

export interface OfflineMethod {
  id: number;
  method_name: string;
  method_fields?: {
    input_name: string;
    placeholder: string;
    is_required: boolean | '1' | 1;
  }[];
}

export interface QidhaWallet {
  availableBalance: number;
  creditLimit: number;
  purchaseLimit: number;
}

export interface PaymentPickerProps {
  isArabic: boolean;

  // selection
  selected: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;

  // wallet / kaidha balances
  walletBalance?: number | null;
  qidhaWallet?: QidhaWallet | null;
  orderTotal?: number;
  hasInsufficientBalance?: boolean;

  // offline
  offlineMethods?: OfflineMethod[];
  selectedOfflineId?: string | null;
  offlineNote?: string;
  offlineFields?: Record<string, string>;
  onOfflineSelect?: (id: string) => void;
  onOfflineNote?: (note: string) => void;
  onOfflineField?: (name: string, value: string) => void;

  // async state for detail panels
  detailsLoading?: boolean;
  detailsError?: string | null;
}

// ─── Static method definitions ────────────────────────────────────────────────

const METHODS: Array<{
  id: PaymentMethod;
  en: string; ar: string;
  descEn: string; descAr: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
    { id: 'cash', en: 'Cash on Delivery', ar: 'الدفع عند الاستلام', descEn: 'Pay at door', descAr: 'ادفع عند الاستلام', Icon: Banknote },
    { id: 'wallet', en: 'Wallet', ar: 'المحفظة', descEn: 'Standard wallet', descAr: 'المحفظة العادية', Icon: Wallet },
    { id: 'kaidha', en: 'Qidha Wallet', ar: 'محفظة قيدها', descEn: 'Qidha wallet', descAr: 'محفظة قيدها', Icon: Wallet },
    { id: 'myfatoorah', en: 'MyFatoorah', ar: 'ماي فاتورة', descEn: 'Digital payment', descAr: 'دفع إلكتروني', Icon: CreditCard },
    { id: 'offline', en: 'Offline Payment', ar: 'الدفع غير المتصل', descEn: 'Bank transfer etc', descAr: 'تحويل بنكي وغيره', Icon: Receipt },
  ];

// ─── Small shared atoms ───────────────────────────────────────────────────────

type BannerVariant = 'info' | 'warn' | 'error';

function Banner({ variant, isArabic, children }: {
  variant: BannerVariant; isArabic: boolean; children: React.ReactNode;
}) {
  const styles: Record<BannerVariant, string> = {
    info: 'bg-blue-50  dark:bg-blue-900/20  border-blue-200  dark:border-blue-800  text-blue-800  dark:text-blue-300',
    warn: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    error: 'bg-red-50   dark:bg-red-900/20   border-red-200   dark:border-red-800   text-red-700   dark:text-red-400',
  };
  const Icon = variant === 'error' ? AlertCircle : Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      className={`mt-3 p-3 border rounded-xl flex items-start gap-2 text-sm font-medium ${styles[variant]} ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </motion.div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={highlight
        ? 'font-bold text-emerald-600 dark:text-emerald-400'
        : 'font-semibold text-gray-900 dark:text-gray-100'}>
        {value}
      </span>
    </div>
  );
}

function FieldInput({ label, value, required, isArabic, onChange }: {
  label: string; value: string; required: boolean;
  isArabic: boolean; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isArabic ? 'text-right' : ''}`}>
        {label}
        {required && <span className="text-red-500 mx-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:outline-none bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 transition-colors ${isArabic ? 'text-right' : ''}`}
      />
    </div>
  );
}

// ─── Detail panels ────────────────────────────────────────────────────────────

function LoadingPanel({ isArabic }: { isArabic: boolean }) {
  return (
    <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
      <Loader2 className="w-4 h-4 animate-spin text-emerald-500 flex-shrink-0" />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {isArabic ? 'جاري التحميل...' : 'Loading…'}
      </span>
    </div>
  );
}

function CashPanel({ isArabic }: { isArabic: boolean }) {
  return (
    <Banner variant="info" isArabic={isArabic}>
      {isArabic ? 'سيتم الدفع نقداً عند الاستلام.' : 'You will pay cash upon delivery.'}
    </Banner>
  );
}

function MyFatoorahPanel({ isArabic }: { isArabic: boolean }) {
  return (
    <Banner variant="info" isArabic={isArabic}>
      <span className={`flex items-center gap-1.5 `}>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
        {isArabic
          ? 'بعد التأكيد ستُحوَّل إلى بوابة MyFatoorah لإتمام الدفع.'
          : 'After confirming you will be redirected to MyFatoorah to complete payment.'}
      </span>
    </Banner>
  );
}

function WalletPanel({ isArabic, title, balance, orderTotal, hasInsufficient, extras }: {
  isArabic: boolean;
  title: string;
  balance: number;
  orderTotal: number;
  hasInsufficient: boolean;
  extras?: Array<{ label: string; value: string }>;
}) {
  const fmt = (n: number) => `${n.toFixed(2)} ${isArabic ? 'ريال' : 'SAR'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl space-y-2.5"
    >
      <div className={`flex items-center gap-2 `}>
        <Wallet className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
      </div>

      <div className="space-y-1.5">
        <SummaryRow
          label={isArabic ? 'الرصيد المتاح' : 'Available Balance'}
          value={fmt(balance)}
          highlight
        />
        {extras?.map((r) => (
          <SummaryRow key={r.label} label={r.label} value={r.value} />
        ))}
        {orderTotal > 0 && (
          <SummaryRow
            label={isArabic ? 'مبلغ الطلب' : 'Order Amount'}
            value={fmt(orderTotal)}
          />
        )}
      </div>

      {hasInsufficient ? (
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 pt-1 border-t border-gray-200 dark:border-gray-600">
          {isArabic
            ? 'الرصيد غير كافٍ. يرجى الشحن أو اختيار طريقة دفع أخرى.'
            : 'Insufficient balance. Please top up or pick another method.'}
        </p>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {isArabic ? 'يُخصم فور تأكيد الطلب.' : 'Deducted immediately on order confirmation.'}
        </p>
      )}
    </motion.div>
  );
}

function OfflinePanel({
  isArabic, offlineMethods, selectedOfflineId,
  offlineNote, offlineFields, onOfflineSelect, onOfflineNote, onOfflineField,
}: Required<Pick<PaymentPickerProps,
  'isArabic' | 'offlineMethods' | 'selectedOfflineId' |
  'offlineNote' | 'offlineFields' | 'onOfflineSelect' | 'onOfflineNote' | 'onOfflineField'
>>) {
  if (offlineMethods.length === 0) {
    return (
      <Banner variant="warn" isArabic={isArabic}>
        {isArabic ? 'لا توجد طرق دفع غير متصل متاحة.' : 'No offline payment methods available.'}
      </Banner>
    );
  }

  const activeMethod = offlineMethods.find((m) => String(m.id) === selectedOfflineId);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      className="mt-3 space-y-3"
    >
      {/* Sub-method selector */}
      <p className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${isArabic ? 'text-right' : ''}`}>
        {isArabic ? 'اختر طريقة التحويل' : 'Select transfer method'}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {offlineMethods.map((m) => {
          const active = String(m.id) === selectedOfflineId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onOfflineSelect(String(m.id))}
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium transition-colors ${isArabic ? 'text-right' : 'text-left'} ${active
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
            >
              <span className={`flex items-center gap-2 `}>
                {active && <Check className="w-4 h-4 flex-shrink-0" />}
                {m.method_name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic fields for chosen method */}
      {activeMethod?.method_fields?.map((f) => {
        const isRequired = f.is_required === true || f.is_required === '1' || f.is_required === 1;
        return (
          <FieldInput
            key={f.input_name}
            label={f.placeholder}
            value={offlineFields[f.input_name] ?? ''}
            required={isRequired}
            isArabic={isArabic}
            onChange={(v) => onOfflineField(f.input_name, v)}
          />
        );
      })}

      {/* Optional note */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isArabic ? 'text-right' : ''}`}>
          {isArabic ? 'ملاحظة (اختياري)' : 'Note (optional)'}
        </label>
        <textarea
          rows={2}
          value={offlineNote}
          onChange={(e) => onOfflineNote(e.target.value)}
          dir={isArabic ? 'rtl' : 'ltr'}
          placeholder={isArabic ? 'أي تفاصيل إضافية...' : 'Any extra details…'}
          className={`w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:outline-none resize-none bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 transition-colors ${isArabic ? 'text-right' : ''}`}
        />
      </div>
    </motion.div>
  );
}

// ─── Detail panel switcher ────────────────────────────────────────────────────

function DetailPanel(props: PaymentPickerProps) {
  const { selected, isArabic, detailsLoading, detailsError, hasInsufficientBalance, orderTotal = 0 } = props;
  if (!selected) return null;

  if (detailsLoading) return <LoadingPanel isArabic={isArabic} />;
  if (detailsError) return <Banner variant="error" isArabic={isArabic}>{detailsError}</Banner>;

  if (selected === 'cash') return <CashPanel isArabic={isArabic} />;
  if (selected === 'myfatoorah') return <MyFatoorahPanel isArabic={isArabic} />;

  if (selected === 'wallet' && props.walletBalance != null) {
    return (
      <WalletPanel
        isArabic={isArabic}
        title={isArabic ? 'المحفظة العادية' : 'Standard Wallet'}
        balance={props.walletBalance}
        orderTotal={orderTotal}
        hasInsufficient={!!hasInsufficientBalance}
      />
    );
  }

  if (selected === 'kaidha' && props.qidhaWallet) {
    const fmt = (n: number) => `${n.toFixed(2)} ${isArabic ? 'ريال' : 'SAR'}`;
    return (
      <WalletPanel
        isArabic={isArabic}
        title={isArabic ? 'محفظة قيدها' : 'Qidha Wallet'}
        balance={props.qidhaWallet.availableBalance}
        orderTotal={orderTotal}
        hasInsufficient={!!hasInsufficientBalance}
        extras={[
          { label: isArabic ? 'حد الائتمان' : 'Credit Limit', value: fmt(props.qidhaWallet.creditLimit) },
          { label: isArabic ? 'حد الشراء' : 'Purchase Limit', value: fmt(props.qidhaWallet.purchaseLimit) },
        ]}
      />
    );
  }

  if (selected === 'offline') {
    return (
      <OfflinePanel
        isArabic={isArabic}
        offlineMethods={props.offlineMethods ?? []}
        selectedOfflineId={props.selectedOfflineId ?? null}
        offlineNote={props.offlineNote ?? ''}
        offlineFields={props.offlineFields ?? {}}
        onOfflineSelect={props.onOfflineSelect ?? (() => { })}
        onOfflineNote={props.onOfflineNote ?? (() => { })}
        onOfflineField={props.onOfflineField ?? (() => { })}
      />
    );
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PaymentPicker(props: PaymentPickerProps) {
  const { isArabic, selected, onSelect } = props;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
      {/* Header */}
      <div className={`flex items-center gap-2 mb-4 `}>
        <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? 'طريقة الدفع' : 'Payment Method'}
        </h3>
      </div>

      {/* Method list */}
      <div className="space-y-2">
        {METHODS.map((m, i) => {
          const isSelected = selected === m.id;
          return (
            <motion.button
              key={m.id}
              type="button"
              initial={{ opacity: 0, x: isArabic ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(m.id)}
              className={`w-full p-3.5 border-2 rounded-xl transition-colors ${isSelected
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                } ${isArabic ? 'text-right' : 'text-left'}`}
            >
              <div className={`flex items-center gap-3 `}>
                {/* Icon badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                  <m.Icon className="w-5 h-5" />
                </div>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {isArabic ? m.ar : m.en}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {isArabic ? m.descAr : m.descEn}
                  </p>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Context panel — animates in/out per method */}
      <AnimatePresence mode="wait">
        {selected && <DetailPanel key={selected} {...props} />}
      </AnimatePresence>
    </div>
  );
}
