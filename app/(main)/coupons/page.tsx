import { Suspense } from "react";

import { CouponsShell } from "@/features/coupons/components/CouponsShell";
import { CouponsList } from "@/features/coupons/components/sections/CouponsList";

export const metadata = {
	title: "الكوبونات",
};

export default function CouponsPage() {
	return (
		<CouponsShell>
			<Suspense fallback={<CouponsList.skeleton />}>
				<CouponsList />
			</Suspense>
		</CouponsShell>
	);
}
