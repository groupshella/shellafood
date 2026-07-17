import { getLoyaltyTransactionsPage } from "@/features/profile/api/points";
import {
	fetchCustomerInfo,
	getFinancialToken,
} from "@/features/profile/lib/financial-http";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { MyPointsClient } from "./MyPointsClient";
import MyPointsSkeleton from "./skeleton";

export const MyPoints = Object.assign(
	async function MyPoints({ isArabic }: { isArabic: boolean }) {
		const lang = isArabic ? "ar" : "en";
		const [storedUser, token] = await Promise.all([
			getProfileUser(),
			getFinancialToken(),
		]);
		if (!storedUser || !token) redirect("/auth");

		const [liveUser, historyResult] = await Promise.all([
			fetchCustomerInfo(token, storedUser, lang).catch(() => null),
			getLoyaltyTransactionsPage(0, 10, lang)
				.then((page) => ({ page, error: null }))
				.catch(() => ({
					page: { groups: [], nextOffset: 10, hasMore: false },
					error: isArabic
						? "تعذر تحميل تاريخ النقاط"
						: "Could not load points history",
				})),
		]);
		const user = liveUser ?? storedUser;

		return (
			<MyPointsClient
				convertiblePoints={user.loyalty_point ?? 0}
				initialPage={historyResult.page}
				initialHistoryError={historyResult.error}
				isArabic={isArabic}
			/>
		);
	},
	{ skeleton: MyPointsSkeleton },
);
