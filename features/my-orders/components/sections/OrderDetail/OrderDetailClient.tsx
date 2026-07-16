"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
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
import type { OrderDetailView, OrderItem } from "@/features/my-orders/types/orders.types";

interface OrderDetailClientProps {
    order: OrderDetailView;
    isArabic: boolean;
}

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-card sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-28 sm:px-4 sm:py-5 sm:pb-32 md:px-5 lg:px-6";

const SHEET_LAYOUT =
    "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-[20px] bg-background px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:max-w-2xl sm:px-5 md:max-w-xl lg:max-w-2xl";

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
    isArabic: boolean;
}

function ReorderModal({ isOpen, isVisible, onClose, onConfirm, isArabic }: ReorderModalProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label={isArabic ? "أعد طلب الأوردر" : "Reorder"}
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : "en"}
                className={SHEET_LAYOUT}
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
                <div className="relative mb-2 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={isArabic ? "إغلاق" : "Close"}
                        className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </button>
                    <h2 className="text-base font-semibold text-foreground sm:text-[16px]">
                        {isArabic ? "أعد طلب الأوردر" : "Reorder"}
                    </h2>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 sm:h-16 sm:w-16">
                        <ShoppingBag className="h-7 w-7 text-brand sm:h-8 sm:w-8" strokeWidth={1.6} aria-hidden />
                    </div>
                    <p className="mt-3 max-w-sm px-2 text-center text-sm leading-relaxed text-muted sm:text-[14px]">
                        {isArabic
                            ? "هل تريد إعادة طلب نفس المنتجات وإضافتها إلى سلة التسوق؟"
                            : "Do you want to reorder the same products and add them to your cart?"}
                    </p>
                </div>
                <div className="mt-6 flex gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-12 flex-1 rounded-xl bg-card py-3.5 text-sm font-semibold text-foreground transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:text-[14px]"
                    >
                        {isArabic ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-12 flex-1 rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-foreground/60 sm:text-[14px]"
                    >
                        {isArabic ? "تأكيد" : "Confirm"}
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
    isArabic: boolean;
}

function ConfirmAddressModal({
    isOpen,
    isVisible,
    onClose,
    onConfirm,
    address,
    isArabic,
}: ConfirmAddressModalProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label={isArabic ? "تأكيد العنوان" : "Confirm address"}
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : "en"}
                className={SHEET_LAYOUT}
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
                <div className="relative mb-2 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={isArabic ? "إغلاق" : "Close"}
                        className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </button>
                    <h2 className="text-base font-semibold text-foreground sm:text-[16px]">
                        {isArabic ? "تأكيد العنوان" : "Confirm address"}
                    </h2>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 sm:h-16 sm:w-16">
                        <MapPin className="h-7 w-7 text-brand sm:h-8 sm:w-8" strokeWidth={1.6} aria-hidden />
                    </div>
                    <p className="mt-3 max-w-md px-3 text-center text-sm font-semibold text-foreground sm:text-[15px]">
                        {address}
                    </p>
                    <p className="mt-1 text-center text-xs text-muted sm:text-[13px]">
                        {isArabic
                            ? "هل هذا هو عنوان التوصيل الصحيح؟"
                            : "Is this the correct delivery address?"}
                    </p>
                </div>
                <div className="mt-6 flex gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-12 flex-1 rounded-xl bg-card py-3.5 text-sm font-semibold text-foreground transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:text-[14px]"
                    >
                        {isArabic ? "تغيير العنوان" : "Change address"}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-12 flex-1 rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-foreground/60 sm:text-[14px]"
                    >
                        {isArabic ? "تأكيد الطلب" : "Confirm order"}
                    </button>
                </div>
            </div>
        </>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-3 text-start text-sm font-bold text-foreground sm:text-[15px] lg:text-base">
            {children}
        </p>
    );
}

const OrderItemRow = memo(function OrderItemRow({ item }: { item: OrderItem }) {
    return (
        <div className="flex items-start gap-2.5 border-b border-border py-3 last:border-b-0 sm:gap-3 sm:py-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card sm:h-[60px] sm:w-[60px]">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Package className="h-5 w-5 text-muted sm:h-6 sm:w-6" strokeWidth={1.4} aria-hidden />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-start text-sm font-semibold leading-snug text-foreground sm:text-[14px]">
                    {item.name}
                </p>
                {item.description && (
                    <p className="mt-0.5 line-clamp-2 text-start text-xs leading-snug text-muted sm:text-[12px]">
                        {item.description}
                    </p>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs font-bold text-foreground sm:text-[13px]">{item.price}</span>
                    {item.originalPrice && (
                        <span className="text-[11px] text-muted line-through sm:text-[12px]">
                            {item.originalPrice}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand sm:h-7 sm:w-7">
                <span className="text-[10px] font-bold text-brand-foreground sm:text-[11px]">
                    {item.quantity}
                </span>
            </div>
        </div>
    );
});

function Divider() {
    return <div className="my-1 h-px bg-border" />;
}

export function OrderDetailClient({ order, isArabic }: OrderDetailClientProps) {
    const router = useRouter();
    const reorderSheet = useBottomSheet();
    const addressSheet = useBottomSheet();

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

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
            <div
                className={SHELL_LAYOUT}
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : "en"}
            >
                <header className="sticky top-0 z-20 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                    <div className={`relative flex items-center justify-center py-3.5 sm:py-4 ${HEADER_PADDING}`}>
                        <button
                            type="button"
                            onClick={handleBack}
                            aria-label={isArabic ? "رجوع" : "Go back"}
                            className="absolute end-3 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:end-4 sm:h-11 sm:w-11"
                        >
                            <ChevronRight
                                className={[
                                    "h-5 w-5 sm:h-[22px] sm:w-[22px]",
                                    isArabic ? "" : "rotate-180",
                                ].join(" ")}
                                strokeWidth={2}
                                aria-hidden
                            />
                        </button>

                        <h1 className="text-base font-bold text-foreground sm:text-[17px] lg:text-lg">
                            {isArabic ? "تفاصيل طلبك" : "Order details"}
                        </h1>

                        <button
                            type="button"
                            aria-label={isArabic ? "حفظ الطلب" : "Save order"}
                            className="absolute start-3 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:start-4 sm:h-11 sm:w-11"
                        >
                            <Bookmark className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.8} aria-hidden />
                        </button>
                    </div>
                </header>

                <div className={CONTENT_PADDING}>
                    <div className="overflow-hidden rounded-2xl bg-background shadow-sm ring-1 ring-border lg:rounded-3xl">
                        <div className="px-3 pb-2 pt-3.5 sm:px-4 sm:pt-4 md:px-5 md:pt-5">
                            <SectionTitle>
                                {isArabic ? "تفاصيل الطلب" : "Order details"}
                            </SectionTitle>

                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-start text-sm font-bold text-foreground sm:text-[15px] lg:text-base">
                                        {order.storeName}
                                    </p>
                                    {order.storeDescription && (
                                        <p className="line-clamp-2 text-start text-xs text-muted sm:text-[13px]">
                                            {order.storeDescription}
                                        </p>
                                    )}
                                </div>
                                <div className="ms-2 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card sm:ms-3 sm:h-14 sm:w-14">
                                    {order.storeLogoUrl ? (
                                        <Image
                                            src={order.storeLogoUrl}
                                            alt={order.storeName}
                                            width={56}
                                            height={56}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ShoppingBag className="h-6 w-6 text-muted" strokeWidth={1.4} aria-hidden />
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
                                <p className="py-4 text-center text-[13px] text-muted">
                                    {isArabic
                                        ? "لا توجد منتجات في هذا الطلب"
                                        : "No products in this order"}
                                </p>
                            )}
                        </div>

                        <Divider />
                        <Divider />

                        <div className="px-3 py-3 sm:px-4 md:px-5">
                            <SectionTitle>
                                {isArabic ? "طريقة الدفع" : "Payment method"}
                            </SectionTitle>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <CreditCard className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.6} aria-hidden />
                                    {order.paymentMethod === "Credit Card" ||
                                    order.paymentMethod === "بطاقة ائتمان" ? (
                                        <span className="inline-block h-3 w-3 rounded-full bg-orange-500 opacity-80" aria-hidden />
                                    ) : null}
                                </div>
                                <span className="text-start text-xs text-foreground sm:text-[13px]">
                                    {order.paymentMethod}
                                </span>
                            </div>
                        </div>

                        <Divider />

                        <div className="px-3 py-3 sm:px-4 md:px-5">
                            <SectionTitle>
                                {isArabic ? "عنوان توصيل" : "Delivery address"}
                            </SectionTitle>
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" strokeWidth={1.8} aria-hidden />
                                <span className="text-start text-xs leading-relaxed text-foreground sm:text-[13px]">
                                    {order.deliveryAddress}
                                </span>
                            </div>
                        </div>

                        <Divider />

                        <div className="px-3 pb-4 pt-3 sm:px-4 md:px-5">
                            <SectionTitle>
                                {isArabic ? "تاريخ الطلب" : "Order date"}
                            </SectionTitle>
                            <div className="flex items-center gap-2">
                                <Clock className="h-[18px] w-[18px] shrink-0 text-brand" strokeWidth={1.8} aria-hidden />
                                <span className="text-start text-xs text-foreground sm:text-[13px]">
                                    {order.orderDate}
                                </span>
                            </div>
                        </div>

                        {order.cancellationReason && (
                            <>
                                <Divider />
                                <div className="px-3 py-3 pb-4 sm:px-4 md:px-5">
                                    <SectionTitle>
                                        {isArabic ? "سبب الإلغاء" : "Cancellation reason"}
                                    </SectionTitle>
                                    <p className="text-start text-[13px] text-red-500">
                                        {order.cancellationReason}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4 md:px-5 lg:px-6">
                    <button
                        type="button"
                        onClick={reorderSheet.open}
                        className="w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mx-auto sm:block sm:max-w-md sm:text-[15px] md:max-w-lg lg:py-4"
                    >
                        {isArabic ? "أعد طلب الأوردر" : "Reorder"}
                    </button>
                </div>
            </div>

            <ReorderModal
                isOpen={reorderSheet.isOpen}
                isVisible={reorderSheet.isVisible}
                onClose={reorderSheet.close}
                onConfirm={handleReorderConfirm}
                isArabic={isArabic}
            />
            <ConfirmAddressModal
                isOpen={addressSheet.isOpen}
                isVisible={addressSheet.isVisible}
                onClose={addressSheet.close}
                onConfirm={handleAddressConfirm}
                address={order.deliveryAddress}
                isArabic={isArabic}
            />
        </>
    );
}
