"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";

export async function deleteAddress(id: number): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const locale = await getServerLocale();
  const isArabic = locale === "ar";

  if (!token) {
    return {
      success: false,
      message: isArabic ? "غير مصرح" : "Unauthorized",
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Localization": locale,
      },
    }
  );

  const json = await res.json();

  if (json.success) {
    updateTag("addresses");
  }

  return { success: json.success, message: json.message };
}
