import { MOCK_CHECKOUT } from "@/features/checkout/constants/checkout.constants";
import { DeliveryMethodClient } from "./DeliveryMethodClient";
import DeliveryMethodSkeleton from "./skeleton";

export const DeliveryMethod = Object.assign(
    function DeliveryMethod() {
        return <DeliveryMethodClient data={MOCK_CHECKOUT} />;
    },
    { skeleton: DeliveryMethodSkeleton }
);
