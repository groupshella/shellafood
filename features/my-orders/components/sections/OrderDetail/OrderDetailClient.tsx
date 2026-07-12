"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronRight,
    Bookmark,
    X,
    ShoppingBag,
    MapPin,
    Clock,
    CreditCard,
    Package,
} from "lucide-react";
import { formatOrderMoney } from "@/features/my-orders/lib/order-detail-mapper";
import type { OrderDetailView, OrderItem } from "@/features/my-orders/types/orders.types";

interface OrderDetailClientProps {
    order: OrderDetailView;
    isArabic: boolean;
}

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-gray-100 dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-28 sm:px-4 sm:py-5 sm:pb-32 md:px-5 lg:px-6";

const SHEET_LAYOUT =
    "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-[20px] bg-white px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-gray-900 sm:max-w-2xl sm:px-5 md:max-w-xl lg:max-w-2xl";

function useBottomSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    }, []);

    const close = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 350);
    }, []);

    return { isOpen, isVisible, open, close };
}

interface ReorderModalProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function ReorderModal({ isOpen, isVisible, onClose, onConfirm }: ReorderModalProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 dark:bg-black/70"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label="أعد طلب الأوردر"
                dir="rtl"
                className={SHEET_LAYOUT}
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="relative mb-2 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </button>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-[16px]">أعد طلب الأوردر</h2>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#EBFEEB] dark:bg-[#0d2e12] sm:h-16 sm:w-16">
                        <ShoppingBag className="h-7 w-7 text-[#30913F] dark:text-[#4db860] sm:h-8 sm:w-8" strokeWidth={1.6} aria-hidden />
                    </div>
                    <p className="mt-3 max-w-sm px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-[14px]">
                        هل تريد إعادة طلب نفس المنتجات وإضافتها إلى سلة التسوق؟
                    </p>
                </div>
                <div className="mt-6 flex gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-12 flex-1 rounded-xl bg-gray-100 py-3.5 text-sm font-semibold text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:text-[14px]"
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-12 flex-1 rounded-xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[14px]"
                    >
                        تأكيد
                    </button>
                </div>
            </div>
        </>
    );
}

interface ConfirmAddressModalProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    address: string;
    isArabic?: boolean;
}

function ConfirmAddressModal({ isOpen, isVisible, onClose, onConfirm, address, isArabic }: ConfirmAddressModalProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 dark:bg-black/70"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label={isArabic ? "تأكيد العنوان" : "Confirm address"}
                dir={isArabic ? "rtl" : "ltr"}
                className={SHEET_LAYOUT}
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="relative mb-2 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={isArabic ? "إغلاق" : "Close"}
                        className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </button>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-[16px]">{isArabic ? "تأكيد العنوان" : "Confirm address"}</h2>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#EBFEEB] dark:bg-[#0d2e12] sm:h-16 sm:w-16">
                        <MapPin className="h-7 w-7 text-[#30913F] dark:text-[#4db860] sm:h-8 sm:w-8" strokeWidth={1.6} aria-hidden />
                    </div>
                    <p className="mt-3 max-w-md px-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                        {address}
                    </p>
                    <p className="mt-1 text-center text-xs text-gray-400 dark:text-gray-500 sm:text-[13px]">
                        {isArabic ? "هل هذا هو عنوان التوصيل الصحيح؟" : "Is this the correct delivery address?"}
                    </p>
                </div>
                <div className="mt-6 flex gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-12 flex-1 rounded-xl bg-gray-100 py-3.5 text-sm font-semibold text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:text-[14px]"
                    >
                        {isArabic ? "تغيير العنوان" : "Change address"}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-12 flex-1 rounded-xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[14px]"
                    >
                        {isArabic ? "تأكيد الطلب" : "Confirm order"}
                    </button>
                </div>
            </div>
        </>
    );
}

function SectionTitle({ children, isArabic }: { children: React.ReactNode; isArabic: boolean }) {
    return (
        <p className="mb-3 text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px] lg:text-base">
            {children}
        </p>
    );
}

function InvoiceRow({
    label,
    value,
    bold = false,
    green = false,
    isArabic = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
    green?: boolean;
    isArabic?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-2 sm:py-2.5" dir={isArabic ? "rtl" : "ltr"}>
            <span
                className={[
                    bold ? "text-sm font-bold sm:text-[14px]" : "text-xs font-medium sm:text-[13px]",
                    green ? "text-[#30913F] dark:text-[#4db860]" : "text-gray-600 dark:text-gray-400",
                ].join(" ")}
            >
                {label}
            </span>
            <span
                className={[
                    bold ? "text-sm font-bold sm:text-[14px]" : "text-xs font-medium sm:text-[13px]",
                    green ? "text-[#30913F] dark:text-[#4db860]" : "text-gray-900 dark:text-gray-100",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}

const OrderItemRow = memo(function OrderItemRow({ item, isArabic }: { item: OrderItem; isArabic?: boolean }) {
    return (
        <div className="flex items-start gap-2.5 border-b border-gray-100 py-3 last:border-b-0 dark:border-gray-700 sm:gap-3 sm:py-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-[60px] sm:w-[60px]">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name || isArabic ? "صورة المنتج" : "Product image"}
                        width={60}
                        height={60}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Package className="h-5 w-5 text-gray-300 dark:text-gray-500 sm:h-6 sm:w-6" strokeWidth={1.4} aria-hidden />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-start text-sm font-semibold leading-snug text-gray-900 dark:text-gray-50 sm:text-[14px]">
                    {item.name || isArabic ? "اسم المنتج" : "Product name"}
                </p>
                {item.description && (
                    <p className="mt-0.5 line-clamp-2 text-start text-xs leading-snug text-gray-400 dark:text-gray-500 sm:text-[12px]">
                        {item.description || isArabic ? "وصف المنتج" : "Product description"}
                    </p>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-50 sm:text-[13px]">{item.price || isArabic ? "السعر" : "Price"}</span>
                    {item.originalPrice && (
                        <span className="text-[11px] text-gray-300 line-through dark:text-gray-500 sm:text-[12px]">{item.originalPrice || isArabic ? "السعر الأصلي" : "Original price"}</span>
                    )}
                </div>
            </div>

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#30913F] sm:h-7 sm:w-7">
                <span className="text-[10px] font-bold text-white sm:text-[11px]">{item.quantity || isArabic ? "الكمية" : "Quantity"}</span>
            </div>
        </div>
    );
});

function Divider() {
    return <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />;
}

export function OrderDetailClient({ order, isArabic }: OrderDetailClientProps) {
    const router = useRouter();
    const reorderSheet = useBottomSheet();
    const addressSheet = useBottomSheet();

    const { fees } = order;

    const handleReorderConfirm = useCallback(() => {
        reorderSheet.close();
        setTimeout(() => addressSheet.open(), 400);
    }, [reorderSheet, addressSheet]);

    const handleAddressConfirm = useCallback(() => {
        addressSheet.close();
        router.push(`/stores/${order.storeId}`);
    }, [addressSheet, router, order.storeId]);

    return (
        <>
            <div className={SHELL_LAYOUT} dir={isArabic ? "rtl" : "ltr"}>
                <header className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className={`relative flex items-center justify-center py-3.5 sm:py-4 ${HEADER_PADDING}`}>

                        <Link
                            href="/my-orders"
                            aria-label={isArabic ? "رجوع" : "Return"}
                            className="absolute start-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:end-4 sm:h-11 sm:w-11"
                        >
                            <ChevronRight className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={2} aria-hidden />
                        </Link>
                        <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-[17px] lg:text-lg">{isArabic ? "تفاصيل طلبك" : "Order details"}</h1>


                    </div>
                </header>

                <div className={CONTENT_PADDING}>
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] lg:rounded-3xl">
                        <div className="px-3 pb-2 pt-3.5 sm:px-4 sm:pt-4 md:px-5 md:pt-5">
                            <SectionTitle isArabic={isArabic}>{isArabic ? "تفاصيل الطلب" : "Order details"}</SectionTitle>

                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px] lg:text-base">
                                        {order.storeName}
                                    </p>
                                    {order.storeDescription && (
                                        <p className="line-clamp-2 text-start text-xs text-gray-400 dark:text-gray-500 sm:text-[13px]">
                                            {order.storeDescription || isArabic ? "وصف المتجر" : "Store description"}
                                        </p>
                                    )}
                                </div>
                                <div className="ms-2 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 sm:ms-3 sm:h-14 sm:w-14">
                                    {order.storeLogoUrl ? (
                                        <Image
                                            src={order.storeLogoUrl}
                                            alt={order.storeName || isArabic ? "صورة المتجر" : "Store image"}
                                            width={56}
                                            height={56}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ShoppingBag className="h-6 w-6 text-gray-300 dark:text-gray-500" strokeWidth={1.4} aria-hidden />
                                    )}
                                </div>
                            </div>

                            {order.items.length > 0 ? (
                                <div>
                                    {order.items.map((item) => (
                                        <OrderItemRow key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-[13px] text-gray-400 dark:text-gray-500">
                                    {isArabic ? "لا توجد منتجات في هذا الطلب" : "No products in this order"}
                                </p>
                            )}
                        </div>

                        <Divider />

                        <div className="px-3 py-3 sm:px-4 md:px-5">
                            <SectionTitle isArabic={isArabic}>{isArabic ? "تفاصيل الفاتورة" : "Invoice details"}</SectionTitle>
                            <InvoiceRow
                                label={isArabic ? "إجمالي المنتجات" : "Total products"}
                                isArabic={isArabic}
                                value={formatOrderMoney(fees.itemsSubtotal)}
                            />
                            <InvoiceRow
                                label={isArabic ? "مصاريف الشحن" : "Shipping fees"}
                                value={formatOrderMoney(fees.deliveryCharge)}
                            />
                            <InvoiceRow
                                label={isArabic ? "رسوم الخدمة" : "Service fees"}
                                value={formatOrderMoney(fees.serviceFee)}
                            />
                            <InvoiceRow
                                label={isArabic ? "كود خصم" : "Discount code"}
                                value={`- ${formatOrderMoney(fees.couponDiscount)}`}
                            />
                            <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
                            <InvoiceRow
                                label={isArabic ? "إجمالي الطلب" : "Total order"}
                                value={formatOrderMoney(fees.total)}
                                bold
                                green
                            />
                        </div>

                        <Divider />

                        <div className="px-3 py-3 sm:px-4 md:px-5">
                            <SectionTitle isArabic={isArabic}>{isArabic ? "طريقة الدفع" : "Payment method"}</SectionTitle>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <CreditCard className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" strokeWidth={1.6} aria-hidden />
                                    {order.paymentMethod === "Credit Card" && (
                                        <span className="inline-block h-3 w-3 rounded-full bg-orange-500 opacity-80" aria-hidden />
                                    )}
                                </div>
                                <span className="text-start text-xs text-gray-700 dark:text-gray-300 sm:text-[13px]">
                                    {order.paymentMethod}
                                </span>
                            </div>
                        </div>

                        <Divider />

                        <div className="px-3 py-3 sm:px-4 md:px-5">
                            <SectionTitle isArabic={isArabic}>{isArabic ? "عنوان توصيل" : "Delivery address"}</SectionTitle>
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#30913F] dark:text-[#4db860]" strokeWidth={1.8} aria-hidden />
                                <span className="text-start text-xs leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[13px]">
                                    {order.deliveryAddress}
                                </span>
                            </div>
                        </div>

                        <Divider />

                        <div className="px-3 pb-4 pt-3 sm:px-4 md:px-5">
                            <SectionTitle isArabic={isArabic}>{isArabic ? "تاريخ الطلب" : "Order date"}</SectionTitle>
                            <div className="flex items-center gap-2">
                                <Clock className="h-[18px] w-[18px] shrink-0 text-[#30913F] dark:text-[#4db860]" strokeWidth={1.8} aria-hidden />
                                <span className="text-start text-xs text-gray-700 dark:text-gray-300 sm:text-[13px]">
                                    {order.orderDate}
                                </span>
                            </div>
                        </div>

                        {order.cancellationReason && (
                            <>
                                <Divider />
                                <div className="px-3 py-3 pb-4 sm:px-4 md:px-5">
                                    <SectionTitle isArabic={isArabic}>{isArabic ? "سبب الإلغاء" : "Cancellation reason"}</SectionTitle>
                                    <p className="text-start text-[13px] text-red-500 dark:text-red-400">
                                        {order.cancellationReason}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-gray-800 dark:bg-gray-900 sm:px-4 sm:py-4 md:px-5 lg:px-6">
                    <button
                        type="button"
                        onClick={reorderSheet.open}
                        className="w-full rounded-xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 sm:mx-auto sm:block sm:max-w-md sm:text-[15px] md:max-w-lg lg:py-4"
                    >
                        {isArabic ? "أعد طلب الأوردر" : "Reorder the order"}
                    </button>
                </div>
            </div>

            <ReorderModal
                isOpen={reorderSheet.isOpen}
                isVisible={reorderSheet.isVisible}
                onClose={reorderSheet.close}
                onConfirm={handleReorderConfirm}
            />
            <ConfirmAddressModal
                isOpen={addressSheet.isOpen}
                isVisible={addressSheet.isVisible}
                onClose={addressSheet.close}
                onConfirm={handleAddressConfirm}
                address={order.deliveryAddress}
            />
        </>
    );
}
