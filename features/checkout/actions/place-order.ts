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

  if (!payload.cart?.length) {
    return { success: false, message: "السلة فارغة" };
  }
  if (!payload.order_amount) {
    return { success: false, message: "لم يتم احتساب مبلغ الطلب" };
  }
  if (!payload.store_id) {
    return { success: false, message: "لم يتم التعرف على المتجر — يرجى إعادة تحميل الصفحة" };
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
        message: json?.message ?? json?.errors?.[0] ?? "تعذر إتمام الطلب",
      };
    }

    // Handle multiple response shapes from the backend
    const orderId =
      json?.order_id ??
      json?.data?.order_id ??
      json?.data?.id ??
      json?.id ??
      json?.order?.id ??
      json?.data?.order?.id;

    if (!orderId) {
      return { success: false, message: "تم الطلب لكن لم يُرجع رقم الطلب" };
    }

    updateTag("cart");
    return { success: true, data: { order_id: orderId } };
  } catch {
    return { success: false, message: "تعذر إتمام الطلب" };
  }
}
