import { MOCK_CHECKOUT } from "@/features/checkout/constants/checkout.constants";
import { CartSummaryClient } from "./CartSummaryClient";
import CartSummarySkeleton from "./skeleton";

export const CartSummary = Object.assign(
    function CartSummary() {
        return <CartSummaryClient data={MOCK_CHECKOUT} />;
    },
    { skeleton: CartSummarySkeleton }
);
