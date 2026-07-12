import { getWalletTransactions } from "@/features/profile/api/wallet";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { MyWalletClient } from "./MyWalletClient";
import MyWalletSkeleton from "./skeleton";

export const MyWallet = Object.assign(
    async function MyWallet() {
        const [user, history] = await Promise.all([
            getProfileUser(),
            getWalletTransactions(),
        ]);
        if (!user) redirect("/auth");

        return (
            <MyWalletClient
                balance={user.wallet_balance ?? 0}
                history={history}
            />
        );
    },
    { skeleton: MyWalletSkeleton },
);
