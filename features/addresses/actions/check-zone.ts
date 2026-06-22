"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

interface CheckZoneAddress {
  formatted_address?: string;
  city?: string;
  region?: string;
  street_name?: string | null;
  country?: string;
}

interface CheckZoneApiResponse {
  success?: boolean;
  in_zone?: boolean;
  zone_id?: number;
  zone_name?: string;
  message?: string;
  address?: CheckZoneAddress;
  error?: string;
  code?: string;
}

export interface CheckZoneResult {
  inZone: boolean;
  message?: string;
  zoneId?: number;
  zoneName?: string;
  city?: string;
  region?: string;
  street_name?: string;
  formattedAddress?: string;
  country?: string;
}

/**
 * Checks if the given coordinates are within the active delivery zone.
 * POST /api/v2/address/check-zone — requires Bearer token.
 */
export async function checkZone(
  lat: number,
  lng: number
): Promise<CheckZoneResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) {
    return {
      inZone: false,
      message: "Authentication token is required",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/address/check-zone`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      }
    );

    const json = (await res.json()) as CheckZoneApiResponse;
    const address = json.address;

    if (res.status === 401 || json.code === "auth-001") {
      return {
        inZone: false,
        message: json.message ?? "Authentication token is required",
      };
    }

    if (!res.ok) {
      return {
        inZone: false,
        message: json.message ?? "Failed to check service zone",
      };
    }

    const inZone = json.in_zone === true;

    return {
      inZone,
      message: inZone ? undefined : json.message,
      zoneId: json.zone_id,
      zoneName: json.zone_name,
      city: address?.city,
      region: address?.region,
      street_name: address?.street_name ?? undefined,
      formattedAddress: address?.formatted_address,
      country: address?.country,
    };
  } catch {
    return {
      inZone: false,
      message: "Failed to check service zone",
    };
  }
}
