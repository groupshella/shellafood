import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { Address } from "../types/address.types";

export async function getAddressDetail(
	id: string,
	lang: "ar" | "en"
): Promise<Address | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
	if (!token) return null;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/details/${id}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
				"X-Localization": lang,
				lang,
			},
			next: { tags: ["addresses", `address-${id}-${lang}`] },
		}
	);

	if (!res.ok) return null;

	const json = await res.json();
	return json ?? null;
}
