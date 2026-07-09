import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

import { MyPointsClient } from "./MyPointsClient";
import MyPointsSkeleton from "./skeleton";

export const MyPoints = Object.assign(
    async function MyPoints() {
        const user = await getProfileUser();
        if (!user) redirect("/auth");

        // History API not wired yet — empty list shows the empty state.
        return (
            <MyPointsClient
                convertiblePoints={user.loyalty_point ?? 0}
                history={[]}
            />
        );
    },
    { skeleton: MyPointsSkeleton },
);
