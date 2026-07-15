import { getRecordedAnalytics } from "@/features/profile/api/qidha";
import { apiSuccess } from "@/shared/lib/api-response";
import type { RecordedAnalyticsInitialData } from "@/features/profile/types/statistics.types";

export async function GET() {
    // getRecordedAnalytics never throws — always returns a safe UI payload.
    const data = await getRecordedAnalytics();
    return apiSuccess<RecordedAnalyticsInitialData>(data);
}
