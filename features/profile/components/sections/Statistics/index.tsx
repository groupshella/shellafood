import { getGeneralAnalytics } from "@/features/profile/api/analytics";
import {
    MOCK_MONTHLY_TRENDS,
    MOCK_QIDHA_DATA,
    MOCK_STATISTICS_CATEGORIES,
} from "@/features/profile/constants/statistics.constants";

import { StatisticsClient } from "./StatisticsClient";
import StatisticsSkeleton from "./skeleton";

export const Statistics = Object.assign(
    async function Statistics() {
        const initialAnalytics = await getGeneralAnalytics("week");

        return (
            <StatisticsClient
                initialAnalytics={initialAnalytics}
                categories={MOCK_STATISTICS_CATEGORIES}
                monthlyTrends={MOCK_MONTHLY_TRENDS}
                qidha={MOCK_QIDHA_DATA}
            />
        );
    },
    { skeleton: StatisticsSkeleton },
);
