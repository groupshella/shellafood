import { Suspense } from "react";

import { QidhaWallet } from "@/features/profile/components/sections/QidhaWallet";

export const metadata = {
    title: "محفظة قيدها | شيلة فود",
    description: "رصيد محفظة قيدها وخيارات الدفع",
};

export default function QidhaWalletPage() {
    return (
        <Suspense fallback={<QidhaWallet.skeleton />}>
            <QidhaWallet />
        </Suspense>
    );
}
