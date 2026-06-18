import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainPage() {
	// const cookieStore = await cookies();


	// const token =
	// 	cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	// const guestId =
	// 	cookieStore.get(COOKIE_KEYS.GUEST_ID)?.value;


	// if (token || guestId) {
	// 	redirect("/home");
	// }

	redirect("/onboarding");
}