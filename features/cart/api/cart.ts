import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { CartItem } from "../types/cart.types";

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const guestId = cookieStore.get(COOKIE_KEYS.GUEST_ID)?.value;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localization": "ar",
    moduleId: process.env.MODULE_ID ?? "3",
    zoneId: process.env.ZONE_ID!,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/cart`);
  if (!token && guestId) {
    url.searchParams.set("guest_id", guestId);
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 0, tags: ["cart"] },
  });

  if (!res.ok) return [];

  const json = await res.json();
  return Array.isArray(json) ? json : [];
}
