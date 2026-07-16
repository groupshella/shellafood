import { PaymentMethodClient } from "./PaymentMethodClient";
import PaymentMethodSkeleton from "./skeleton";

export const PaymentMethod = Object.assign(
	function PaymentMethod({ isArabic }: { isArabic: boolean }) {
		return <PaymentMethodClient isArabic={isArabic} />;
	},
	{ skeleton: PaymentMethodSkeleton },
);
