import { DiscountCodeClient } from "./DiscountCodeClient";
import DiscountCodeSkeleton from "./skeleton";

export const DiscountCode = Object.assign(
    function DiscountCode({ isArabic }: { isArabic: boolean }) {
        return <DiscountCodeClient isArabic={isArabic} />;
    },
    { skeleton: DiscountCodeSkeleton }
);
