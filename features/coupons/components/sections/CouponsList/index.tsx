import { getCoupons } from "@/features/coupons/api/coupons";
import { CouponsListClient } from "@/features/coupons/components/sections/CouponsList/CouponsListClient";
import { CouponsEmpty } from "@/features/coupons/components/sections/CouponsList/CouponsEmpty";
import CouponsListSkeleton from "@/features/coupons/components/sections/CouponsList/skeleton";
import {
	couponsExpiredByDate,
	couponsNotExpiredByDate,
	sortCouponsForFirstTab,
} from "@/features/coupons/lib/coupon-utils";

export const CouponsList = Object.assign(
	async function CouponsList({ isArabic }: { isArabic: boolean }) {
		const lang = isArabic ? "ar" : "en";
		try {
			const coupons = await getCoupons(lang);

			if (coupons.length === 0) {
				return <CouponsEmpty isArabic={isArabic} />;
			}

			const available = sortCouponsForFirstTab(couponsNotExpiredByDate(coupons));
			const expired = couponsExpiredByDate(coupons);

			if (available.length === 0 && expired.length === 0) {
				return <CouponsEmpty isArabic={isArabic} />;
			}

			return (
				<CouponsListClient
					available={available}
					expired={expired}
					isArabic={isArabic}
				/>
			);
		} catch {
			return (
				<CouponsEmpty
					isArabic={isArabic}
					message={
						isArabic
							? "لا يوجد كوبونات في الوقت الحالي"
							: "No coupons available right now"
					}
				/>
			);
		}
	},
	{ skeleton: CouponsListSkeleton }
);
