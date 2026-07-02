import { CouponTicketIllustration } from "@/features/coupons/components/shared/CouponTicketIllustration";

type CouponsEmptyProps = {
	message?: string;
};

export function CouponsEmpty({ message = "لا يوجد كوبونات في الوقت الحالي" }: CouponsEmptyProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
			<CouponTicketIllustration className="h-40 w-40 sm:h-48 sm:w-48" />
			<p className="max-w-[220px] text-sm font-bold leading-6 text-gray-800">{message}</p>
		</div>
	);
}
