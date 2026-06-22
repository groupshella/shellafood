"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { CreateAddressPayload, CreateAddressResponse } from "../types/address.types";

export interface AddAddressResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  addressId?: number;
}

export async function addAddress(
  payload: CreateAddressPayload
): Promise<AddAddressResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) return { success: false, message: "غير مصرح" };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Localization": "ar",
    },
    body: JSON.stringify(payload),
  });

  const json: CreateAddressResponse = await res.json();

  if (json.success) {
    updateTag("addresses");
    return {
      success: true,
      message: json.message,
      addressId: json.address?.id,
    };
  }

  return {
    success: false,
    message: json.message,
    errors: json.errors,
  };
}
