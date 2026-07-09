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
	async function CouponsList() {
		try {
			const coupons = await getCoupons();

			if (coupons.length === 0) {
				return <CouponsEmpty />;
			}

			const available = sortCouponsForFirstTab(couponsNotExpiredByDate(coupons));
			const expired = couponsExpiredByDate(coupons);

			if (available.length === 0 && expired.length === 0) {
				return <CouponsEmpty />;
			}

			return <CouponsListClient available={available} expired={expired} />;
		} catch {
			return <CouponsEmpty message="لا يوجد كوبونات في الوقت الحالي" />;
		}
	},
	{ skeleton: CouponsListSkeleton }
);
