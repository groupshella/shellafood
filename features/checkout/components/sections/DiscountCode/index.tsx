import { DiscountCodeClient } from "./DiscountCodeClient";
import DiscountCodeSkeleton from "./skeleton";

export const DiscountCode = Object.assign(
    function DiscountCode() {
        return <DiscountCodeClient />;
    },
    { skeleton: DiscountCodeSkeleton }
);
