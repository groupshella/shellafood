import type { AuthUser } from "@/features/auth/types/auth.types";
import { getProfileJoinStatuses } from "@/features/profile/lib/get-join-statuses";
import { ProfileHomeClient } from "./ProfileHomeClient";

export async function ProfileHome({
	user,
	isArabic,
}: {
	user: AuthUser;
	isArabic: boolean;
}) {
	const lang = isArabic ? "ar" : "en";
	const joinStatuses = await getProfileJoinStatuses(user, lang);
	return (
		<ProfileHomeClient
			user={user}
			joinStatuses={joinStatuses}
			isArabic={isArabic}
		/>
	);
}
