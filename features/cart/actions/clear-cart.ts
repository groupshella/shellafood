"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { CartActionResult } from "../types/cart.types";

export async function clearCart(): Promise<CartActionResult> {
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

  if (token) headers.Authorization = `Bearer ${token}`;

  const body: Record<string, unknown> = {};
  if (!token && guestId) body.guest_id = guestId;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/cart/clear`, {
    method: "DELETE",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { success: false, message: "تعذّر تفريغ السلة" };
  }

  updateTag("cart");
  return { success: true, items: [] };
}
