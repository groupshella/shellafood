import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { QIDHA_STRINGS } from "@/features/profile/constants/qidha.strings";
import type { QidhaWalletCard } from "@/features/profile/types/qidha.types";
import { redirect } from "next/navigation";

import { QidhaWalletClient } from "./QidhaWalletClient";
import QidhaWalletSkeleton from "./skeleton";

function buildQidhaCard(user: {
    qidha_wallet_balance?: number | null;
    id: number;
}): QidhaWalletCard {
    const available = Number(user.qidha_wallet_balance ?? 0);
    // Placeholder credit fields until a dedicated Qidha API is wired.
    const creditLimit = Math.max(available, 4500);
    const usedBalance = Math.max(0, creditLimit - available);

    return {
        availableBalance: available,
        usedBalance,
        creditLimit,
        cardNumber: `2026${String(user.id).padStart(8, "0")}`.slice(0, 12),
        expiryDate: "11-6-2026",
        statusLabel: QIDHA_STRINGS.available,
    };
}

export const QidhaWallet = Object.assign(
    async function QidhaWallet() {
        const user = await getProfileUser();
        if (!user) redirect("/auth");

        if (!user.qidha_wallet_active) {
            redirect("/profile/wallet-subscription");
        }

        return (
            <QidhaWalletClient
                card={buildQidhaCard(user)}
                fullAmountDue={31.95}
                minimumAmountDue={31.95}
            />
        );
    },
    { skeleton: QidhaWalletSkeleton },
);
