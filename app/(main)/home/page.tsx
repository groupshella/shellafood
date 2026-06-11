import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import HomePage from "@/features/home/components/HomePage";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	title: "الرئيسية | شلة فود",
	description: "تصفّح العروض والمتاجر واطلب ما تحب من شلة فود",
};

export default async function HomeRoute() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	return <HomePage isAuthenticated={token ? true : false} />
}