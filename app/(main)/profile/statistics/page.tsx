import { Suspense } from "react";

import { Statistics } from "@/features/profile/components/sections/Statistics";

export const metadata = {
    title: "إحصائيات | شيلة فود",
    description: "ملخص إنفاقك واتجاهاتك ومنتجاتك الأكثر شراءً",
};

export default function StatisticsPage() {
    return (
        <Suspense fallback={<Statistics.skeleton />}>
            <Statistics />
        </Suspense>
    );
}
