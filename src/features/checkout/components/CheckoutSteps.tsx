'use client';

import { useState } from 'react';
import { CheckCircle, MapPin, CreditCard, ShoppingBag, Loader2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { CheckoutState, DeliveryInfo, OrderType } from '../types/checkout.types';
import { formatPrice, getPaymentLabel } from '../utils/checkout.utils';

// ─── Confirm Step ─────────────────────────────────────────────────────────────

interface ConfirmStepProps {
    state: CheckoutState;
    orderAmount: number;
    storeName: string;
    itemCount: number;
    isLoading: boolean;
    onPlaceOrder: () => Promise<void>;
}

export function ConfirmStep({
    state,
    orderAmount,
    storeName,
    itemCount,
    isLoading,
    onPlaceOrder,
}: ConfirmStepProps) {
    const [placing, setPlacing] = useState(false);

    const handlePlace = async () => {
        setPlacing(true);
        try {
            await onPlaceOrder();
        } finally {
            setPlacing(false);
        }
    };

    const total =
        orderAmount +
        (state.deliveryInfo?.delivery_charge ?? 0) +
        (state.deliveryInfo?.additional_charge ?? 0) +
        state.dmTips;

    return (
        <div className="space-y-4">
            {/* Store info */}
            <SummaryCard icon={<ShoppingBag size={18} className="text-emerald-500" />} title="المتجر">
                <p className="text-sm text-gray-700 font-semibold text-right">{storeName}</p>
                <p className="text-xs text-gray-400 text-right">{itemCount} منتج</p>
            </SummaryCard>

            {/* Delivery address */}
            {state.orderType === 'delivery' && state.address && (
                <SummaryCard
                    icon={<MapPin size={18} className="text-blue-500" />}
                    title="عنوان التوصيل"
                >
                    <p className="text-sm text-gray-700 text-right">{state.address.address}</p>
                    {state.address.contact_person_number && (
                        <p className="text-xs text-gray-400 text-right mt-0.5">
                            {state.address.contact_person_number}
                        </p>
                    )}
                </SummaryCard>
            )}

            {/* Payment method */}
            <SummaryCard
                icon={<CreditCard size={18} className="text-purple-500" />}
                title="طريقة الدفع"
            >
                <p className="text-sm text-gray-700 font-semibold text-right">
                    {state.paymentMethod ? getPaymentLabel(state.paymentMethod, 'ar') : '—'}
                </p>
            </SummaryCard>

            {/* Price breakdown */}
            <div className="bg-white rounded-3xl p-4 shadow-sm space-y-2">
                <PriceRow label="المجموع الفرعي" value={orderAmount} />
                {state.orderType === 'delivery' && (
                    <PriceRow
                        label="رسوم التوصيل"
                        value={state.deliveryInfo?.delivery_charge ?? 0}
                    />
                )}
                {(state.deliveryInfo?.additional_charge ?? 0) > 0 && (
                    <PriceRow label="رسوم إضافية" value={state.deliveryInfo!.additional_charge} />
                )}
                {state.dmTips > 0 && <PriceRow label="إكرامية السائق" value={state.dmTips} />}
                <div className="border-t border-gray-100 pt-2 mt-2">
                    <PriceRow label="الإجمالي" value={total} bold />
                </div>
            </div>

            {/* Note */}
            {state.orderNote && (
                <div className="bg-amber-50 rounded-2xl px-4 py-3 text-right">
                    <p className="text-xs text-amber-600 font-medium">ملاحظة: {state.orderNote}</p>
                </div>
            )}

            {/* Place order button */}
            <button
                onClick={handlePlace}
                disabled={placing || isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-200 disabled:opacity-60 transition-all active:scale-[0.98]"
            >
                {placing ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>جاري تأكيد الطلب...</span>
                    </>
                ) : (
                    <>
                        <CheckCircle size={20} />
                        <span>تأكيد الطلب • {formatPrice(total)}</span>
                    </>
                )}
            </button>

            <p className="text-center text-xs text-gray-400">
                بالضغط على تأكيد، أنت توافق على الشروط والأحكام
            </p>
        </div>
    );
}

// ─── Success Step ─────────────────────────────────────────────────────────────

export function SuccessStep({ orderId }: { orderId: number }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-8 text-center" dir="rtl">
            {/* Animated checkmark */}
            <div className="relative mb-8">
                <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-200 flex items-center justify-center animate-pulse">
                        <CheckCircle size={48} className="text-emerald-500" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                    <Package size={16} className="text-white" />
                </div>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2">تم الطلب! 🎉</h1>
            <p className="text-gray-500 text-sm mb-1">
                رقم الطلب: <span className="font-bold text-gray-700">#{orderId}</span>
            </p>
            <p className="text-gray-400 text-sm mb-10">
                سيتم إشعارك فور قبول الطلب
            </p>

            <div className="w-full max-w-xs space-y-3">
                <button
                    onClick={() => router.push(`/orders/${orderId}`)}
                    className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200"
                >
                    تتبع الطلب
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 rounded-2xl bg-white text-gray-600 font-semibold"
                >
                    العودة للرئيسية
                </button>
            </div>
        </div>
    );
}

// ─── Checkout Summary (sticky bottom) ────────────────────────────────────────

interface CheckoutSummaryProps {
    orderAmount: number;
    deliveryInfo: DeliveryInfo | null;
    dmTips: number;
    orderType: OrderType;
}

export function CheckoutSummary({
    orderAmount,
    deliveryInfo,
    dmTips,
    orderType,
}: CheckoutSummaryProps) {
    const deliveryFee =
        orderType === 'delivery' ? (deliveryInfo?.delivery_charge ?? null) : 0;
    const total = orderAmount + (deliveryFee ?? 0) + dmTips;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4">
            <div className="max-w-2xl mx-auto flex items-center justify-between" dir="rtl">
                <div className="text-right">
                    <p className="text-xs text-gray-400">الإجمالي</p>
                    <p className="text-lg font-black text-gray-900">{formatPrice(total)}</p>
                </div>
                {deliveryFee !== null && orderType === 'delivery' && (
                    <div className="text-left">
                        <p className="text-xs text-gray-400">التوصيل</p>
                        <p className="text-sm font-semibold text-gray-600">
                            {deliveryFee === 0 ? (
                                <span className="text-emerald-500">مجاناً</span>
                            ) : (
                                formatPrice(deliveryFee)
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SummaryCard({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-end gap-2 mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{title}</p>
                {icon}
            </div>
            {children}
        </div>
    );
}

function PriceRow({
    label,
    value,
    bold = false,
}: {
    label: string;
    value: number;
    bold?: boolean;
}) {
    return (
        <div className="flex items-center justify-between" dir="rtl">
            <span className={`text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                {label}
            </span>
            <span className={`text-sm ${bold ? 'font-black text-gray-900' : 'text-gray-700'}`}>
                {formatPrice(value)}
            </span>
        </div>
    );
}