import { MOCK_CHECKOUT } from "@/features/checkout/constants/checkout.constants";
import { PaymentMethodClient } from "./PaymentMethodClient";
import PaymentMethodSkeleton from "./skeleton";

export const PaymentMethod = Object.assign(
    function PaymentMethod() {
        return <PaymentMethodClient data={MOCK_CHECKOUT} />;
    },
    { skeleton: PaymentMethodSkeleton }
);
