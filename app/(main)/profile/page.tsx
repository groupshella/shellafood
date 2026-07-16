import type { Metadata } from "next";
import { ProfileShell } from "@/features/profile/components/ProfileShell";
import { ProfileHome } from "@/features/profile/components/sections/ProfileHome";
import { ProfileEditProvider } from "@/features/profile/context/ProfileEditContext";
import { getProfileUser, isProfileAuthenticated } from "@/features/profile/lib/get-profile-user";
import { isArabicLocale } from "@/shared/lib/locale";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "حسابي | شيلة فود" : "My account | Shella Food",
		description: isArabic
			? "إدارة حسابك ومحفظتك وإعداداتك في شيلة فود"
			: "Manage your account, wallet, and settings in Shella Food",
	};
}

export default async function ProfilePage() {
	const isArabic = await isArabicLocale();
	const isAuthenticated = await isProfileAuthenticated();
	if (!isAuthenticated) return null;

	const user = await getProfileUser();
	if (!user) redirect("/auth");

	return (
		<ProfileEditProvider user={user}>
			<ProfileShell isArabic={isArabic}>
				<ProfileHome user={user} isArabic={isArabic} />
			</ProfileShell>
		</ProfileEditProvider>
	);
}
