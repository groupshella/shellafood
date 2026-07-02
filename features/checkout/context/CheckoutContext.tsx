"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import type {
    CheckoutData,
    ElectronicPaymentType,
    PaymentMethodType,
} from "@/features/checkout/types/checkout.types";

function parseInvoiceAmount(formatted: string): number {
    return Number(formatted.replace(/[^\d.]/g, "")) || 0;
}

function isPaymentReady(selected: PaymentMethodType): boolean {
    return selected !== null;
}

interface CheckoutContextValue {
    data: CheckoutData;
    selected: PaymentMethodType;
    electronicMethod: ElectronicPaymentType;
    showPaymentWarning: boolean;
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
    const [selected, setSelectedState] = useState<PaymentMethodType>(null);
    const [electronicMethod, setElectronicMethodState] = useState<ElectronicPaymentType>(null);
    const [showPaymentWarning, setShowPaymentWarning] = useState(false);

    const setSelected = (id: PaymentMethodType) => {
        setSelectedState(id);
        setShowPaymentWarning(false);
        if (id !== "electronic") {
            setElectronicMethodState(null);
        }
    };

    const setElectronicMethod = (id: ElectronicPaymentType) => {
        setElectronicMethodState(id);
        setShowPaymentWarning(false);
    };

    const confirmPayment = useCallback(() => {
        if (!isPaymentReady(selected)) {
            setShowPaymentWarning(true);
            return;
        }

        if (selected === "electronic") {
            const params = new URLSearchParams({
                orderId: String(data.orderId),
                amount: String(parseInvoiceAmount(data.invoice.total)),
                currency: "SAR",
            });
            router.push(`/checkout/payment?${params.toString()}`);
        }
    }, [data, router, selected]);

    return (
        <CheckoutContext.Provider
            value={{
                data,
                selected,
                electronicMethod,
                showPaymentWarning,
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
