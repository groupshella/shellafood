"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaceOrder } from "@/features/checkout/hooks/usePlaceOrder";
import type {
    CheckoutData,
    ElectronicPaymentType,
    PaymentMethodType,
    PlaceOrderPayload,
} from "@/features/checkout/types/checkout.types";
import type { AddressListItem } from "@/features/addresses/types/address.types";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import { useNotification } from "@/shared/components/NotificationToast";

function parseInvoiceAmount(formatted: string): number {
    return Number(formatted.replace(/[^\d.]/g, "")) || 0;
}

async function qidhaDebit(amount: number, orderId: number): Promise<void> {
    const res = await fetch("/api/profile/qidha/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, order_id: orderId }),
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { message?: string }).message ?? "فشل الخصم من محفظة قيدها");
    }
}

interface CheckoutContextValue {
    data: CheckoutData;
    payload: PlaceOrderPayload;
    selected: PaymentMethodType;
    electronicMethod: ElectronicPaymentType;
    showPaymentWarning: boolean;
    isPlacingOrder: boolean;
    orderError: string | null;
    setSelected: (id: PaymentMethodType) => void;
    setElectronicMethod: (id: ElectronicPaymentType) => void;
    updateDeliveryAddress: (address: AddressListItem) => void;
    confirmPayment: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

interface CheckoutProviderProps {
    data: CheckoutData;
    children: React.ReactNode;
}

export function CheckoutProvider({ data, children }: CheckoutProviderProps) {
    const router = useRouter();
    const { placeOrder, isLoading: isPlacingOrder } = usePlaceOrder();
    const { error: notifyError, success: notifySuccess } = useNotification();

    const [selected, setSelectedState] = useState<PaymentMethodType>(null);
    const [electronicMethod, setElectronicMethodState] = useState<ElectronicPaymentType>(null);
    const [showPaymentWarning, setShowPaymentWarning] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [payload, setPayload] = useState<PlaceOrderPayload>(data.placeOrderPayload);

    const setSelected = (id: PaymentMethodType) => {
        setSelectedState(id);
        setShowPaymentWarning(false);
        setOrderError(null);
        if (id !== "electronic") {
            setElectronicMethodState(null);
        }
    };

    const setElectronicMethod = (id: ElectronicPaymentType) => {
        setElectronicMethodState(id);
        setShowPaymentWarning(false);
    };

    const updateDeliveryAddress = useCallback((address: AddressListItem) => {
        setPayload((prev) => ({
            ...prev,
            address: formatAddressLine(address),
            latitude: String(address.latitude),
            longitude: String(address.longitude),
        }));
    }, []);

    const confirmPayment = useCallback(async () => {
        if (!selected) {
            setShowPaymentWarning(true);
            notifyError("بالرجاء تحديد طريقة الدفع");
            return;
        }

        setOrderError(null);

        // ── My Wallet ──────────────────────────────────────────────────────────
        if (selected === "my-wallet") {
            try {
                const { order_id } = await placeOrder({ ...payload, payment_method: "wallet" });
                notifySuccess("تم تأكيد طلبك بنجاح 🎉");
                router.push(`/my-orders/${order_id}`);
            } catch (err) {
                const message = err instanceof Error ? err.message : "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى";
                setOrderError(message);
                notifyError(message);
            }
            return;
        }

        // ── Qidha Wallet ───────────────────────────────────────────────────────
        if (selected === "qidha-wallet") {
            try {
                const { order_id } = await placeOrder({ ...payload, payment_method: "wallet" });
                try {
                    await qidhaDebit(payload.order_amount, order_id);
                } catch {
                    // Qidha debit failed — order is already placed, navigate and let backend reconcile
                }
                notifySuccess("تم تأكيد طلبك بنجاح 🎉");
                router.push(`/my-orders/${order_id}`);
            } catch (err) {
                const message = err instanceof Error ? err.message : "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى";
                setOrderError(message);
                notifyError(message);
            }
            return;
        }

        // ── Electronic / MyFatoorah ────────────────────────────────────────────
        try {
            const { order_id } = await placeOrder(payload);

            const params = new URLSearchParams({
                orderId: String(order_id),
                amount: String(parseInvoiceAmount(data.invoice.total)),
                currency: "SAR",
            });

            router.push(`/checkout/payment?${params.toString()}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى";
            setOrderError(message);
            notifyError(message);
        }
    }, [data.invoice.total, notifyError, payload, placeOrder, router, selected]);

    return (
        <CheckoutContext.Provider
            value={{
                data,
                payload,
                selected,
                electronicMethod,
                showPaymentWarning,
                isPlacingOrder,
                orderError,
                setSelected,
                setElectronicMethod,
                updateDeliveryAddress,
                confirmPayment,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error("useCheckout must be used within CheckoutProvider");
    }
    return context;
}
