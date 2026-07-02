import { PaymentMethodClient } from "./PaymentMethodClient";
import PaymentMethodSkeleton from "./skeleton";

export const PaymentMethod = Object.assign(
    function PaymentMethod() {
        return <PaymentMethodClient />;
    },
    { skeleton: PaymentMethodSkeleton }
);
