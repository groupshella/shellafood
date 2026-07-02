import { getCoupons } from "@/features/coupons/api/coupons";
import { CouponsListClient } from "@/features/coupons/components/sections/CouponsList/CouponsListClient";
import CouponsListSkeleton from "@/features/coupons/components/sections/CouponsList/skeleton";
import {
	couponsExpiredByDate,
	couponsNotExpiredByDate,
	sortCouponsForFirstTab,
} from "@/features/coupons/lib/coupon-utils";

export const CouponsList = Object.assign(
	async function CouponsList() {
		const coupons = await getCoupons();

		const available = sortCouponsForFirstTab(couponsNotExpiredByDate(coupons));
		const expired = couponsExpiredByDate(coupons);

		return <CouponsListClient available={available} expired={expired} />;
	},
	{ skeleton: CouponsListSkeleton }
);
