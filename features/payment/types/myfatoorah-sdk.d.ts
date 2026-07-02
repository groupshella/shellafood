// features/payment/types/myfatoorah-sdk.d.ts
import type { MyFatoorahCallbackResponse } from "@/features/payment/types/payment.types";

export interface MyFatoorahInitConfig {
    sessionId: string;
    containerId: string;
    callback: (response: MyFatoorahCallbackResponse) => void;
    shouldHandlePaymentUrl?: boolean;
    countryCode?: string;
    currencyCode?: string;
    amount?: string | number;
    language?: "en" | "ar";
    settings?: {
        loader?: { display?: "none" | "block" };
        card?: Record<string, unknown>;
        button?: { useCustomButton?: boolean };
        separator?: Record<string, unknown>;
    };
    subscribedEvents?: string[];
    eventListener?: (eventName: string, payload: unknown) => void;
}

export interface MyFatoorahSDK {
    init: (config: MyFatoorahInitConfig) => void;
    submitCardPayment: () => void;
    validateCardInputs: () => Promise<unknown>;
    submitCvv?: (token: string) => void;
}

declare global {
    interface Window {
        myfatoorah?: MyFatoorahSDK;
    }
}
