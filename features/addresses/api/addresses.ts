import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { AddressListItem, ListAddressesResponse } from "../types/address.types";

export async function getAddresses({ isArabic }: { isArabic: boolean }): Promise<AddressListItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) return [];

  const language = isArabic ? "ar" : "en";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Localization": language,
      zoneId: process.env.ZONE_ID!,
    },
    next: { revalidate: 0, tags: ["addresses"] },
  });

  if (!res.ok) return [];

  const json: ListAddressesResponse = await res.json();
  return json.addresses ?? [];
}
