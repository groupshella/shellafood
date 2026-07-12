import type { Metadata } from "next";
import { WalletSubscriptionClient } from "@/features/profile/components/sections/WalletSubscription/WalletSubscriptionClient";

export const metadata: Metadata = {
    title: "اشتراك المحفظة | شيلة فود",
    description: "اشترك في محفظة شيلة فود وفعّل مزايا الرصيد",
};

export default function WalletSubscriptionPage() {
    return <WalletSubscriptionClient />;
}
