import { Suspense } from "react";

import { MyWallet } from "@/features/profile/components/sections/MyWallet";

export const metadata = {
    title: "محفظتي | شيلة فود",
    description: "رصيد محفظتك وتاريخ المعاملات",
};

export default function MyWalletPage() {
    return (
        <Suspense fallback={<MyWallet.skeleton />}>
            <MyWallet />
        </Suspense>
    );
}
