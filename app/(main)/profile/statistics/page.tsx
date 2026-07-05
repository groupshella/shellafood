import {
    MOCK_MONTHLY_TRENDS,
    MOCK_QIDHA_DATA,
    MOCK_STATISTICS_CATEGORIES,
    StatisticsClient,
} from "@/features/profile/components/sections/Statistics/StatisticsClient";

export default function StatisticsPage() {
    return (
        <StatisticsClient
            products={[]}
            categories={MOCK_STATISTICS_CATEGORIES}
            monthlyTrends={MOCK_MONTHLY_TRENDS}
            qidha={MOCK_QIDHA_DATA}
        />
    );
}
