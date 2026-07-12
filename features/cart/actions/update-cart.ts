"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
import {
  CartActionResult,
  CartErrorResponse,
  getCartErrorMessage,
  parseCartItems,
} from "../types/cart.types";

interface UpdateCartPayload {
  cart_id: number;
  quantity: number;
}

export async function updateCart(payload: UpdateCartPayload): Promise<CartActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const guestId = cookieStore.get(COOKIE_KEYS.GUEST_ID)?.value;
  const locale = await getServerLocale();
  const isArabic = locale === "ar";

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localization": locale,
    moduleId: process.env.MODULE_ID ?? "3",
    zoneId: process.env.ZONE_ID!,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const body: Record<string, unknown> = {
    cart_id: payload.cart_id,
    quantity: payload.quantity,
  };

  if (!token && guestId) body.guest_id = guestId;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/cart/update`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    const err = json as CartErrorResponse;
    return {
      success: false,
      errorCode: err.error_code,
      message: getCartErrorMessage(err.error_code, isArabic),
    };
  }

  updateTag("cart");
  return { success: true, items: parseCartItems(json) };
}
