import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
import type { QidhaWalletApiData, QidhaWalletCard } from "@/features/profile/types/qidha.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

async function getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function authHeaders(token: string, locale: "ar" | "en"): HeadersInit {
    return {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-localization": locale,
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

function adaptQidhaCard(
    data: QidhaWalletApiData,
    isArabic: boolean,
    userId?: number,
): QidhaWalletCard {
    const available = Number(data.available_balance ?? 0);
    const creditLimit = Number(data.credit_limit ?? Math.max(available, 4500));
    const usedBalance = Number(data.used_balance ?? Math.max(0, creditLimit - available));
    const availableLabel = isArabic ? "متاح" : "Available";

    const cardNumber =
        data.card_number ??
        `2026${String(userId ?? 0).padStart(8, "0")}`.slice(0, 12);

    return {
        availableBalance: available,
        usedBalance,
        creditLimit,
        cardNumber,
        expiryDate: data.expiry_date ?? "11-6-2026",
        statusLabel: data.status === "active" ? availableLabel : (data.status ?? availableLabel),
    };
}

export interface QidhaWalletResult {
    card: QidhaWalletCard;
    fullAmountDue: number;
    minimumAmountDue: number;
}

export async function getQidhaWallet(userId?: number): Promise<QidhaWalletResult | null> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();
    if (!token) return null;

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/qidha-wallet/get-wallet`,
            { headers: authHeaders(token, locale), cache: "no-store" },
        );
        if (!res.ok) return null;

        const json = await res.json();
        const data: QidhaWalletApiData =
            json?.data?.wallet ?? json?.data ?? json?.wallet ?? json;

        return {
            card: adaptQidhaCard(data, isArabic, userId),
            fullAmountDue: Number(data.full_amount_due ?? 0),
            minimumAmountDue: Number(data.minimum_amount_due ?? 0),
        };
    } catch {
        return null;
    }
}
