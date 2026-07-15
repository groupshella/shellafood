import { getGeneralAnalytics } from "@/features/profile/api/analytics";
import { getRecordedAnalytics } from "@/features/profile/api/qidha";

import { StatisticsClient } from "./StatisticsClient";
import StatisticsSkeleton from "./skeleton";

export const Statistics = Object.assign(
    async function Statistics() {
        const [initialAnalytics, initialRecorded] = await Promise.all([
            getGeneralAnalytics("week"),
            getRecordedAnalytics(),
        ]);

        return (
            <StatisticsClient
                initialAnalytics={initialAnalytics}
                initialRecorded={initialRecorded}
            />
        );
    },
    { skeleton: StatisticsSkeleton },
);
