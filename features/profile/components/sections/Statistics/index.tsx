import { getGeneralAnalytics } from "@/features/profile/api/analytics";
import { getRecordedAnalytics } from "@/features/profile/api/qidha";

import { StatisticsClient } from "./StatisticsClient";
import StatisticsSkeleton from "./skeleton";

export const Statistics = Object.assign(
	async function Statistics({ isArabic }: { isArabic: boolean }) {
		const lang = isArabic ? "ar" : "en";
		const [initialAnalytics, initialRecorded] = await Promise.all([
			getGeneralAnalytics("week", lang),
			getRecordedAnalytics(lang),
		]);

		return (
			<StatisticsClient
				initialAnalytics={initialAnalytics}
				initialRecorded={initialRecorded}
				isArabic={isArabic}
			/>
		);
	},
	{ skeleton: StatisticsSkeleton },
);
