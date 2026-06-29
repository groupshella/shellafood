"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { MOCK_ORDERS } from "@/features/my-orders/constants/mock-orders";
import type { Order, OrderItem } from "@/features/my-orders/types/orders.types";

interface OrderDetailClientProps {
    orderId: string;
}

/* ─── Modal helpers ─────────────────────────────────────────── */

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

/* ─── ReorderModal ──────────────────────────────────────────── */

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
                className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label="أعد طلب الأوردر"
                dir="rtl"
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-[20px] bg-white px-5 pb-10 pt-3 shadow-2xl"
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200" />
                <div className="relative mb-2 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute start-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <h2 className="text-[16px] font-semibold text-gray-900">أعد طلب الأوردر</h2>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBFEEB]">
                        <ShoppingBag className="h-8 w-8 text-[#30913F]" strokeWidth={1.6} />
                    </div>
                    <p className="mt-3 px-2 text-center text-[14px] leading-relaxed text-gray-500">
                        هل تريد إعادة طلب نفس المنتجات وإضافتها إلى سلة التسوق؟
                    </p>
                </div>
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-[#F6F5F8] py-3.5 text-[14px] font-semibold text-gray-700 transition-colors active:bg-gray-200"
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                    >
                        تأكيد
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─── ConfirmAddressModal ───────────────────────────────────── */

interface ConfirmAddressModalProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    address: string;
}

function ConfirmAddressModal({ isOpen, isVisible, onClose, onConfirm, address }: ConfirmAddressModalProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label="تأكيد العنوان"
                dir="rtl"
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-[20px] bg-white px-5 pb-10 pt-3 shadow-2xl"
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200" />
                <div className="relative mb-2 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute start-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <h2 className="text-[16px] font-semibold text-gray-900">تأكيد العنوان</h2>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBFEEB]">
                        <MapPin className="h-8 w-8 text-[#30913F]" strokeWidth={1.6} />
                    </div>
                    <p className="mt-3 px-4 text-center text-[15px] font-semibold text-gray-900">
                        {address}
                    </p>
                    <p className="mt-1 text-center text-[13px] text-gray-400">
                        هل هذا هو عنوان التوصيل الصحيح؟
                    </p>
                </div>
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-[#F6F5F8] py-3.5 text-[14px] font-semibold text-gray-700 transition-colors active:bg-gray-200"
                    >
                        تغيير العنوان
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                    >
                        تأكيد الطلب
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─── Section title ─────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-3 text-right text-[15px] font-bold text-gray-900">
            {children}
        </p>
    );
}

/* ─── Invoice row ───────────────────────────────────────────── */

function InvoiceRow({
    label,
    value,
    bold = false,
    green = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
    green?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-2" dir="rtl">
            {/* label on right */}
            <span
                className={[
                    bold ? "text-[14px] font-bold" : "text-[13px] font-medium",
                    green ? "text-[#30913F]" : "text-gray-600",
                ].join(" ")}
            >
                {label}
            </span>
            {/* value on left */}
            <span
                className={[
                    bold ? "text-[14px] font-bold" : "text-[13px] font-medium",
                    green ? "text-[#30913F]" : "text-gray-900",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}

/* ─── Order item row ────────────────────────────────────────── */

function OrderItemRow({ item }: { item: OrderItem }) {
    return (
        /*
         * Layout (RTL, row-reverse):
         *   [quantity •] [text block ··] [image placeholder]
         *   LEFT          CENTER           RIGHT
         */
        <div className="flex  items-start gap-3 border-b border-gray-100 py-3 last:border-b-0">

            {/* RIGHT — product image placeholder */}
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl bg-[#F6F5F8]">
                <Package className="h-6 w-6 text-gray-300" strokeWidth={1.4} />
            </div>

            {/* CENTER — item info */}
            <div className="min-w-0 flex-1">
                <p className="text-right text-[14px] font-semibold text-gray-900 leading-snug">
                    {item.name}
                </p>
                <p className="mt-0.5 text-right text-[12px] text-gray-400 leading-snug">
                    {item.description}
                </p>
                {/* price row: original (strikethrough) then current */}
                <div className="mt-1.5 flex  items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-900">{item.price}</span>
                    {item.originalPrice && (
                        <span className="text-[12px] text-gray-300 line-through">{item.originalPrice}</span>
                    )}
                </div>
            </div>

            {/* LEFT — quantity circle */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#30913F]">
                <span className="text-[11px] font-bold text-white">{item.quantity}</span>
            </div>
        </div>
    );
}

/* ─── Thin divider between sections ────────────────────────── */

function Divider() {
    return <div className="my-1 h-px bg-gray-100" />;
}

/* ─── Main component ────────────────────────────────────────── */

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
    const router = useRouter();
    const reorderSheet = useBottomSheet();
    const addressSheet = useBottomSheet();

    const order: Order | undefined = MOCK_ORDERS.find((o) => o.id === Number(orderId));

    const handleReorderConfirm = useCallback(() => {
        reorderSheet.close();
        setTimeout(() => addressSheet.open(), 400);
    }, [reorderSheet, addressSheet]);

    const handleAddressConfirm = useCallback(() => {
        addressSheet.close();
    }, [addressSheet]);

    if (!order) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white" dir="rtl">
                <ShoppingBag className="mb-4 h-12 w-12 text-gray-300" strokeWidth={1.4} />
                <p className="text-[15px] font-semibold text-gray-700">لم يتم العثور على الطلب</p>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mt-4 text-[13px] text-[#30913F] underline-offset-2 hover:underline"
                >
                    العودة للطلبات
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto min-h-screen w-full max-w-lg bg-white" dir="rtl">

                {/* ── Header ── */}
                <header className="sticky top-0 z-20 bg-white shadow-sm">
                    <div className="relative flex items-center justify-center px-5 py-4">

                        {/* Back — left side in RTL layout (visually left) */}
                        <button
                            type="button"
                            onClick={() => router.back()}
                            aria-label="العودة"
                            className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                        >
                            <ChevronRight className="h-5 w-5" strokeWidth={2} />
                        </button>

                        <h1 className="text-[17px] font-bold text-gray-900">تفاصيل طلبك</h1>

                        {/* Bookmark — right side */}
                        <button
                            type="button"
                            aria-label="حفظ الطلب"
                            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                        >
                            <Bookmark className="h-[18px] w-[18px]" strokeWidth={1.8} />
                        </button>
                    </div>
                </header>

                {/* ── Single scrollable card ── */}
                <div className="px-4 py-4 pb-28">
                    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">

                        {/* ── SECTION: تفاصيل الطلب ── */}
                        <div className="px-4 pt-4 pb-2">
                            <SectionTitle>تفاصيل الطلب</SectionTitle>

                            {/* Store row: bookmark left, store info right */}
                            <div className="mb-4 flex  items-center justify-between">
                                {/* RIGHT: store name + description */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-right text-[15px] font-bold text-gray-900">
                                        {order.storeName}
                                    </p>
                                    <p className="text-right text-[13px] text-gray-400">
                                        {order.storeDescription}
                                    </p>
                                </div>
                                {/* LEFT: image placeholder square */}
                                <div className="mr-3 flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-xl bg-[#F6F5F8]">
                                    <ShoppingBag className="h-6 w-6 text-gray-300" strokeWidth={1.4} />
                                </div>
                            </div>

                            {/* Order items */}
                            <div>
                                {order.items.map((item) => (
                                    <OrderItemRow key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        <Divider />

                        {/* ── SECTION: تفاصيل الفاتورة ── */}
                        <div className="px-4 py-3">
                            <SectionTitle>تفاصيل الفاتورة</SectionTitle>
                            <InvoiceRow label="إجمالي المنتجات" value={order.subtotal} />
                            <InvoiceRow label="مصاريف الشحن" value={order.deliveryFee} />
                            <InvoiceRow label="رسوم الخدمة" value={order.serviceFee} />
                            <InvoiceRow label="كود خصم" value={`- ${order.discount}`} />
                            <div className="my-2 h-px bg-gray-200" />
                            <InvoiceRow label="إجمالي الطلب" value={order.total} bold green />
                        </div>

                        <Divider />

                        {/* ── SECTION: طريقة الدفع ── */}
                        <div className="px-4 py-3">
                            <SectionTitle>طريقة الدفع</SectionTitle>
                            <div className="flex  items-center gap-2">
                                {/* LEFT: credit card icon with orange/red dot like Mastercard */}
                                <div className="flex items-center gap-1">
                                    <CreditCard className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={1.6} />
                                    {/* Mastercard-style indicator */}
                                    <span className="inline-block h-3 w-3 rounded-full bg-orange-500 opacity-80" />
                                </div>
                                {/* RIGHT: label */}
                                <span className="text-right text-[13px] text-gray-700">
                                    {order.paymentMethod}
                                </span>

                            </div>
                        </div>

                        <Divider />

                        {/* ── SECTION: عنوان توصيل ── */}
                        <div className="px-4 py-3">
                            <SectionTitle>عنوان توصيل</SectionTitle>
                            <div className="flex  items-start gap-2">
                                {/* LEFT: pin icon */}
                                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#30913F]" strokeWidth={1.8} />

                                {/* RIGHT: address text */}
                                <span className="text-right text-[13px] leading-relaxed text-gray-700">
                                    {order.orderAddress}
                                </span>

                            </div>
                        </div>

                        <Divider />

                        {/* ── SECTION: تاريخ الطلب ── */}
                        <div className="px-4 pt-3 pb-4">
                            <SectionTitle>تاريخ الطلب</SectionTitle>
                            <div className="flex  items-center gap-2">
                                {/* LEFT: clock icon */}
                                <Clock className="h-[18px] w-[18px] shrink-0 text-[#30913F]" strokeWidth={1.8} />
                                {/* RIGHT: date text */}
                                <span className="text-right text-[13px] text-gray-700">
                                    {order.orderDate}
                                </span>

                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Fixed bottom bar ── */}
                <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white px-4 py-4">
                    <button
                        type="button"
                        onClick={reorderSheet.open}
                        className="w-full rounded-xl bg-[#30913F] py-3.5 text-[15px] font-semibold text-white transition-colors active:bg-[#267332]"
                    >
                        أعد طلب الأوردر
                    </button>
                </div>
            </div>

            {/* ── Modals ── */}
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
                address={order.orderAddress}
            />
        </>
    );
}