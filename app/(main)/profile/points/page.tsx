import { Suspense } from "react";

import { MyPoints } from "@/features/profile/components/sections/MyPoints";

export const metadata = {
    title: "نقاطي | شيلة فود",
    description: "نقاطك القابلة للتحويل وتاريخ النقاط",
};

export default function MyPointsPage() {
    return (
        <Suspense fallback={<MyPoints.skeleton />}>
            <MyPoints />
        </Suspense>
    );
}
