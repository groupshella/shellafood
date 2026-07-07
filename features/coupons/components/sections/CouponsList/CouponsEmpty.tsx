import { CouponTicketIllustration } from "@/features/coupons/components/shared/CouponTicketIllustration";

type CouponsEmptyProps = {
	message?: string;
};

export function CouponsEmpty({ message = "لا يوجد كوبونات في الوقت الحالي" }: CouponsEmptyProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center sm:gap-5 sm:px-6 sm:py-16 lg:py-24">
			<CouponTicketIllustration className="h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44" />
			<p className="max-w-[220px] text-sm font-bold leading-6 text-gray-700 dark:text-gray-300 sm:max-w-xs sm:text-[15px] sm:leading-7">
				{message}
			</p>
		</div>
	);
}
