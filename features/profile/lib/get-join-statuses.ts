import {
    checkDriverRegistration,
    fetchDelegateStatus,
} from "@/features/profile/actions/join.actions";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type {
    JoinRegistrationState,
    ProfileJoinStatuses,
} from "@/features/profile/types/join.types";

export async function getProfileJoinStatuses(
    user: AuthUser,
): Promise<ProfileJoinStatuses> {
    const [driverResult, delegateResult] = await Promise.allSettled([
        checkDriverRegistration({
            phone: user.phone || undefined,
            email: user.email || undefined,
        }),
        fetchDelegateStatus(),
    ]);

    const driver: JoinRegistrationState =
        driverResult.status === "fulfilled"
            ? driverResult.value.status
            : "none";

    const delegate =
        delegateResult.status === "fulfilled"
            ? delegateResult.value.status
            : "none";

    return { driver, delegate };
}
