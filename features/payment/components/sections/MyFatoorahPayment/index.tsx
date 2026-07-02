// features/payment/components/sections/MyFatoorahPayment/index.tsx
import { MyFatoorahPaymentClient } from "./MyFatoorahPaymentClient";
import { PaymentInvalidParams } from "./PaymentInvalidParams";
import MyFatoorahPaymentSkeleton from "./skeleton";
import type { CreateSessionRequest } from "@/features/payment/types/payment.types";

interface MyFatoorahPaymentProps {
    orderId: number;
    amount: number;
    currency: string;
    language: CreateSessionRequest["language"];
    isGuest: boolean;
}

function isValidPaymentParams(orderId: number, amount: number) {
    return Number.isFinite(orderId) && orderId > 0 && Number.isFinite(amount) && amount > 0;
}

/**
 * This section has no server-side fetch: the payment session depends on
 * live order data known at render time on the client, and must be created
 * fresh every time the screen mounts (never reuse a stale session_id).
 * Follows the "client-only section" pattern from the architecture doc.
 */
export const MyFatoorahPayment = Object.assign(
    function MyFatoorahPayment(props: MyFatoorahPaymentProps) {
        if (!isValidPaymentParams(props.orderId, props.amount)) {
            return <PaymentInvalidParams />;
        }
        return <MyFatoorahPaymentClient {...props} />;
    },
    { skeleton: MyFatoorahPaymentSkeleton }
);
