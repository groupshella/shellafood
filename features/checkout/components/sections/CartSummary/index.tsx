import { getCart } from "@/features/cart/api/cart";
import { CartEmpty } from "@/features/cart/components/sections/CartList/CartEmpty";
import { CartSummaryClient } from "./CartSummaryClient";
import CartSummarySkeleton from "./skeleton";

export const CartSummary = Object.assign(
	async function CartSummary({ isArabic }: { isArabic: boolean }) {
		const items = await getCart(isArabic ? "ar" : "en");

		if (items.length === 0) {
			return <CartEmpty isArabic={isArabic} />;
		}

		return <CartSummaryClient items={items} isArabic={isArabic} />;
	},
	{ skeleton: CartSummarySkeleton },
);
