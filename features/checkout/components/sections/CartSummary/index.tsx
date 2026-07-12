import { getCart } from "@/features/cart/api/cart";
import { CartEmpty } from "@/features/cart/components/sections/CartList/CartEmpty";
import { CartSummaryClient } from "./CartSummaryClient";
import CartSummarySkeleton from "./skeleton";

export const CartSummary = Object.assign(
    async function CartSummary({ isArabic }: { isArabic: boolean }) {
        const items = await getCart({ isArabic });

        if (items.length === 0) {
            return <CartEmpty />;
        }

        return <CartSummaryClient items={items} />;
    },
    { skeleton: CartSummarySkeleton }
);