"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

export async function deleteAddress(id: number): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) return { success: false, message: "غير مصرح" };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const json = await res.json();

  if (json.success) {
    updateTag("addresses");
  }

  return { success: json.success, message: json.message };
}
