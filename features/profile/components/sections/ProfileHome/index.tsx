import type { AuthUser } from "@/features/auth/types/auth.types";
import { getProfileJoinStatuses } from "@/features/profile/lib/get-join-statuses";
import { ProfileHomeClient } from "./ProfileHomeClient";

export async function ProfileHome({ user }: { user: AuthUser }) {
    const joinStatuses = await getProfileJoinStatuses(user);
    return <ProfileHomeClient user={user} joinStatuses={joinStatuses} />;
}
