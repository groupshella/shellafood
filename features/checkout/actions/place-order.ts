"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type {
  PlaceOrderPayload,
  PlaceOrderResult,
} from "../types/checkout.types";

export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<PlaceOrderResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (!token) {
    return { success: false, message: "غير مصرح" };
  }

  if (!payload.cart?.length || !payload.order_amount || !payload.store_id) {
    return { success: false, message: "بيانات الطلب غير مكتملة" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/place`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          zoneId: process.env.ZONE_ID ?? "[2]",
          moduleId: process.env.MODULE_ID ?? "3",
          "X-localization": "ar",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: json?.message ?? "تعذر إتمام الطلب",
      };
    }

    const orderId = json?.order_id ?? json?.data?.order_id;
    if (!orderId) {
      return { success: false, message: "تم الطلب لكن لم يُرجع رقم الطلب" };
    }

    updateTag("cart");
    return { success: true, data: { order_id: orderId } };
  } catch {
    return { success: false, message: "تعذر إتمام الطلب" };
  }
}
