import { getLoyaltyTransactions } from "@/features/profile/api/points";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { MyPointsClient } from "./MyPointsClient";
import MyPointsSkeleton from "./skeleton";

export const MyPoints = Object.assign(
    async function MyPoints() {
        const [user, history] = await Promise.all([
            getProfileUser(),
            getLoyaltyTransactions(),
        ]);
        if (!user) redirect("/auth");

        return (
            <MyPointsClient
                convertiblePoints={user.loyalty_point ?? 0}
                history={history}
            />
        );
    },
    { skeleton: MyPointsSkeleton },
);
