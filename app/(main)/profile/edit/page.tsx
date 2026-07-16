import type { Metadata } from "next";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { EditProfilePageClient } from "@/features/profile/components/sections/EditProfile";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "تعديل الحساب | شيلة فود"
			: "Edit account | Shella Food",
		description: isArabic
			? "حدّث بيانات حسابك الشخصية وصورة الملف الشخصي"
			: "Update your personal details and profile photo",
	};
}

export default async function EditProfilePage() {
	const isArabic = await isArabicLocale();
	const cookieStore = await cookies();
	const rawUser = cookieStore.get(COOKIE_KEYS.USER)?.value;
	if (!rawUser) redirect("/auth");

	const user = JSON.parse(rawUser) as AuthUser;

	return <EditProfilePageClient user={user} isArabic={isArabic} />;
}
