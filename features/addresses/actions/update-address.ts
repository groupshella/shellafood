"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { UpdateAddressPayload, UpdateAddressResponse } from "../types/address.types";

export interface UpdateAddressResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function updateAddress(
  id: number,
  payload: UpdateAddressPayload
): Promise<UpdateAddressResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) return { success: false, message: "غير مصرح" };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Localization": "ar",
      },
      body: JSON.stringify(payload),
    }
  );

  const json: UpdateAddressResponse = await res.json();

  if (json.success) {
    updateTag("addresses");
    updateTag(`address-${id}`);
    return { success: true, message: json.message };
  }

  return {
    success: false,
    message: json.message,
    errors: json.errors,
  };
}
