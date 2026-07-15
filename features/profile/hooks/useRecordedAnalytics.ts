"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { QIDHA_BFF } from "@/features/profile/constants/qidha.constants";
import type {
    FetchStatus,
    RecordedAnalyticsInitialData,
} from "@/features/profile/types/statistics.types";
import { unwrap, type ApiResponse } from "@/shared/lib/api-response";

interface RecordedAnalyticsState extends RecordedAnalyticsInitialData {
    status: FetchStatus;
}

async function fetchRecorded(
    signal: AbortSignal,
): Promise<RecordedAnalyticsInitialData | null> {
    try {
        const res = await fetch(QIDHA_BFF.recorded, { signal, cache: "no-store" });
        if (!res.ok) return null;
        const json = (await res.json()) as ApiResponse<RecordedAnalyticsInitialData>;
        if (!json.success) return null;
        return unwrap(json);
    } catch {
        return null;
    }
}

export function useRecordedAnalytics(params: {
    initialData?: RecordedAnalyticsInitialData | null;
    enabled?: boolean;
}) {
    const { initialData = null, enabled = true } = params;

    const [state, setState] = useState<RecordedAnalyticsState>(() => ({
        qidha: initialData?.qidha ?? {
            availableBalance: "00.00",
            totalBalance: "00.00",
            creditLimit: "00.00",
            usedBalance: "00.00",
            highestPurchase: "00.00",
            dailyAverage: "00.00",
            monthlyTotal: "00.00",
            dueTotal: "00.00",
            paidTotal: "00.00",
            overdueCount: 0,
            pendingCount: 0,
            statusLabel: "نشط",
            usedPercentage: 0,
        },
        categories: initialData?.categories ?? [],
        monthlyTrends: initialData?.monthlyTrends ?? [],
        salaryDay: initialData?.salaryDay ?? null,
        transactions: initialData?.transactions ?? [],
        status: initialData ? "success" : "idle",
    }));

    const [reloadKey, setReloadKey] = useState(0);
    const skipInitial = useRef(Boolean(initialData));

    useEffect(() => {
        if (!enabled) return;
        if (skipInitial.current && reloadKey === 0) {
            skipInitial.current = false;
            return;
        }

        const controller = new AbortController();
        setState((s) => ({ ...s, status: "loading" }));

        fetchRecorded(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                if (!data) {
                    setState((s) => ({ ...s, status: "error" }));
                    return;
                }
                setState({ ...data, status: "success" });
            })
            .catch(() => {
                if (controller.signal.aborted) return;
                setState((s) => ({ ...s, status: "error" }));
            });

        return () => controller.abort();
    }, [enabled, reloadKey]);

    const retry = useCallback(() => setReloadKey((k) => k + 1), []);

    return { ...state, retry };
}
