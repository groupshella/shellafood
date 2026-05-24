'use client';

/**
 * CartPage — root cart page
 *
 * Logic:  useCart  +  useCheckout  +  usePaymentDetails (for balance/offline methods)
 * UI:     StoreGroup · PaymentPicker · OrderSummary · modals · skeletons
 *
 * Rule: no API calls here, no business logic — delegate everything to hooks.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── hooks ──────────────────────────────────────────────────────────────────────
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { usePaymentDetails } from '../hooks/usePaymentDetails'; // unchanged from your original
import { usePayment } from '../hooks/usePayment';        // unchanged from your original
import { useLanguage } from '@/providers';
import { useToast } from '@/shared/components/ui';

// ── components ─────────────────────────────────────────────────────────────────
import { StoreGroup } from './StoreGroup';
import { PaymentPicker } from './PaymentPicker';
import { OrderSummary } from './OrderSummary';
import { ConfirmCheckoutModal } from './ConfirmCheckoutModal';
import { ClearCartModal } from './ClearCartModal';
import { EmptyCart } from './EmptyCart';
import { CartSkeleton } from './CartSkeleton';
import { ToastContainer } from '@/shared/components/ui';
import AddressSelector from '@/features/home/components/DeliveryAddressHero/AddressSelector';
import type { Address } from '@/shared/hooks/useAddresses';

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_FEE_PCT = 2;
const FREE_DELIVERY_THRESHOLD = 100;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartPageProps {
  initialCartData?: unknown;
  token?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Group CartItem[] by storeName */
function groupByStore(items: ReturnType<typeof useCart>['items']) {
  const map = new Map<string, typeof items>();
  for (const item of items) {
    const list = map.get(item.storeName) ?? [];
    list.push(item);
    map.set(item.storeName, list);
  }
  return map;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartPage({ initialCartData, token = '' }: CartPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { toasts, showToast, removeToast } = useToast();

  // ── cart state ──────────────────────────────────────────────────────────────
  const {
    items, isLoading, isUpdating,
    subtotal, itemsCount,
    updateQuantity, removeItem, clearAll,
  } = useCart(initialCartData);

  // ── address ─────────────────────────────────────────────────────────────────
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // ── payment selection ────────────────────────────────────────────────────────
  const {
    selectedPaymentMethod,
    selectedOfflineMethodId,
    offlineCustomerNote,
    offlineFieldValues,
    selectPaymentMethod,
    selectOfflineMethod,
    setOfflineCustomerNote,
    setOfflineFieldValue,
  } = usePayment();

  // ── payment details (balances, offline methods) ───────────────────────────────
  const serviceFee = Math.round(subtotal * (SERVICE_FEE_PCT / 100) * 100) / 100;
  const total = subtotal + serviceFee; // deliveryFee from backend when ready
  const deliveryFee = 0;

  const paymentDetails = usePaymentDetails(
    selectedPaymentMethod,
    token != "",
    total,
    selectedOfflineMethodId,
  );

  // ── checkout ─────────────────────────────────────────────────────────────────
  const { checkout, isProcessing } = useCheckout();

  // ── modal state ──────────────────────────────────────────────────────────────
  const [showConfirm, setShowConfirm] = useState(false);
  const [showClear, setShowClear] = useState(false);

  // ── derived ──────────────────────────────────────────────────────────────────
  const storeGroups = useMemo(() => groupByStore(items), [items]);

  const canCheckout = useMemo(() => {
    if (!items.length) return false;
    if (!selectedAddress) return false;
    if (!selectedPaymentMethod) return false;
    if (paymentDetails.hasInsufficientBalance) return false;
    if (!paymentDetails.isPaymentReady) return false;
    return true;
  }, [items, selectedAddress, selectedPaymentMethod, paymentDetails]);

  // ── handlers ─────────────────────────────────────────────────────────────────

  const handleCheckoutClick = useCallback(() => {
    if (!token) { router.push('/login'); return; }
    if (!selectedAddress) {
      showToast(isArabic ? 'اختر عنوان التوصيل' : 'Select a delivery address', 'warning');
      return;
    }
    if (!selectedPaymentMethod) {
      showToast(isArabic ? 'اختر طريقة الدفع' : 'Select a payment method', 'warning');
      return;
    }
    if (!canCheckout) {
      showToast(isArabic ? 'تحقق من بياناتك' : 'Please check your details', 'warning');
      return;
    }
    setShowConfirm(true);
  }, [token, selectedAddress, selectedPaymentMethod, canCheckout, isArabic, showToast, router]);

  const handleConfirm = useCallback(async () => {
    if (!selectedAddress || !selectedPaymentMethod) return;

    const result = await checkout({
      items,
      address: {
        id: selectedAddress.id,
        address: selectedAddress.address ?? '',
        latitude: selectedAddress.latitude ?? '0',
        longitude: selectedAddress.longitude ?? '0',
      },
      paymentMethod: selectedPaymentMethod,
      totals: { total },
      offlineMethodId: selectedOfflineMethodId ?? undefined,
      offlineNote: offlineCustomerNote || undefined,
      offlineFields: offlineFieldValues,
    });

    setShowConfirm(false);

    if (result.success) {

      showToast(
        isArabic ? 'تم وضع الطلب بنجاح' : 'Order placed successfully',
        'success',
      );
    } else {
      showToast(result.error ?? (isArabic ? 'فشل إتمام الطلب' : 'Failed to place order'), 'error');
    }
  }, [
    items, selectedAddress, selectedPaymentMethod,
    total, selectedOfflineMethodId, offlineCustomerNote, offlineFieldValues,
    checkout, isArabic, showToast,
  ]);

  const handleClearConfirm = useCallback(async () => {
    const ok = await clearAll();
    setShowClear(false);
    if (ok) showToast(isArabic ? 'تم مسح السلة' : 'Cart cleared', 'success');
    else showToast(isArabic ? 'حدث خطأ' : 'Something went wrong', 'error');
  }, [clearAll, isArabic, showToast]);

  // ── render ────────────────────────────────────────────────────────────────────

  if (!isLoading && items.length === 0) {
    return (
      <>
        <EmptyCart isArabic={isArabic} onShop={() => router.push('/categories')} />
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
      </>
    );
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div className={`flex items-center justify-between mb-6 `}>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {isArabic ? 'سلة التسوق' : 'Shopping Cart'}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              {itemsCount} {isArabic ? (itemsCount === 1 ? 'منتج' : 'منتجات') : (itemsCount === 1 ? 'item' : 'items')}
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClear(true)}
              disabled={isUpdating}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-40`}
            >
              <Trash2 className="w-4 h-4" />
              {isArabic ? 'مسح الكل' : 'Clear all'}
            </button>
          )}
        </div>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <CartSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Left — items + address + payment */}
            <div className="lg:col-span-2 space-y-5">

              {/* Store groups */}
              <AnimatePresence initial={false}>
                {[...storeGroups.entries()].map(([storeName, storeItems]) => (
                  <StoreGroup
                    key={storeName}
                    storeName={storeName}
                    items={storeItems}
                    isArabic={isArabic}
                    isUpdating={isUpdating}
                    onIncrease={updateQuantity}
                    onDecrease={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>

              {/* Address */}
              <AddressSelector
                token={token}
                onAddressChange={setSelectedAddress}
              />

              {/* Payment */}
              <PaymentPicker
                isArabic={isArabic}
                selected={selectedPaymentMethod}
                onSelect={selectPaymentMethod}
                walletBalance={paymentDetails.walletBalance ?? undefined}
                qidhaWallet={paymentDetails.qidhaWallet ?? undefined}
                orderTotal={total}
                hasInsufficientBalance={paymentDetails.hasInsufficientBalance}
                offlineMethods={paymentDetails.offlineMethods}
                selectedOfflineId={selectedOfflineMethodId}
                offlineNote={offlineCustomerNote}
                offlineFields={offlineFieldValues}
                onOfflineSelect={selectOfflineMethod}
                onOfflineNote={setOfflineCustomerNote}
                onOfflineField={setOfflineFieldValue}
                detailsLoading={paymentDetails.isLoading}
                detailsError={paymentDetails.error}
              />
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                isArabic={isArabic}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                total={total}
                isLoading={isProcessing}
                canCheckout={canCheckout && !isUpdating}
                estimatedTime={items.length > 0 ? (isArabic ? '30-45 دقيقة' : '30-45 min') : undefined}
                freeDeliveryThreshold={FREE_DELIVERY_THRESHOLD}
                onCheckout={handleCheckoutClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <ConfirmCheckoutModal
        isOpen={showConfirm}
        isArabic={isArabic}
        isProcessing={isProcessing}
        total={total}
        itemsCount={itemsCount}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <ClearCartModal
        isOpen={showClear}
        isArabic={isArabic}
        isLoading={isUpdating}
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClear(false)}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
    </div>
  );
}
