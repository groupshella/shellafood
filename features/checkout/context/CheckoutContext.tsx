"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaceOrder } from "@/features/checkout/hooks/usePlaceOrder";
import type {
    CheckoutData,
    ElectronicPaymentType,
    PaymentMethodType,
} from "@/features/checkout/types/checkout.types";
import { useNotification } from "@/shared/components/NotificationToast";

function parseInvoiceAmount(formatted: string): number {
    return Number(formatted.replace(/[^\d.]/g, "")) || 0;
}

interface CheckoutContextValue {
    data: CheckoutData;
    selected: PaymentMethodType;
    electronicMethod: ElectronicPaymentType;
    showPaymentWarning: boolean;
    isPlacingOrder: boolean;
    orderError: string | null;
    setSelected: (id: PaymentMethodType) => void;
    setElectronicMethod: (id: ElectronicPaymentType) => void;
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
    const { error: notifyError } = useNotification();

    const [selected, setSelectedState] = useState<PaymentMethodType>(null);
    const [electronicMethod, setElectronicMethodState] = useState<ElectronicPaymentType>(null);
    const [showPaymentWarning, setShowPaymentWarning] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

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

    const confirmPayment = useCallback(async () => {
        if (!selected) {
            setShowPaymentWarning(true);
            notifyError("بالرجاء تحديد طريقة الدفع");
            return;
        }

        if (selected !== "electronic") {
            // wallet flows — not yet implemented
            return;
        }

        setOrderError(null);

        try {
            const { order_id } = await placeOrder(data.placeOrderPayload);

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
    }, [data, notifyError, placeOrder, router, selected]);

    return (
        <CheckoutContext.Provider
            value={{
                data,
                selected,
                electronicMethod,
                showPaymentWarning,
                isPlacingOrder,
                orderError,
                setSelected,
                setElectronicMethod,
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
