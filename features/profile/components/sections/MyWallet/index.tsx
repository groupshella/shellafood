import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { MyWalletClient } from "./MyWalletClient";
import MyWalletSkeleton from "./skeleton";

export const MyWallet = Object.assign(
    async function MyWallet() {
        const user = await getProfileUser();
        if (!user) redirect("/auth");

        // History API not wired yet — empty list shows the empty state.
        return (
            <MyWalletClient
                balance={user.wallet_balance ?? 0}
                history={[]}
            />
        );
    },
    { skeleton: MyWalletSkeleton },
);
