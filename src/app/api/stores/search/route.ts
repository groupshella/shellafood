import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/features/auth/constants/auth.constants";

const API_ROOT = `${BASE_URL}/api/v1`;

/** Proxies Laravel `GET .../stores/search` (forwards `name`, pagination, etc.). */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forward = new URLSearchParams(searchParams);
  for (const key of [
    "moduleId",
    "zoneId",
    "latitude",
    "longitude",
    "lat",
    "lng",
    "locale",
  ]) {
    forward.delete(key);
  }

  const zoneRaw = searchParams.get("zoneId");
  const zoneId =
    !zoneRaw || zoneRaw === ""
      ? "[2]"
      : zoneRaw.startsWith("[")
        ? zoneRaw
        : Number.isFinite(Number(zoneRaw))
          ? JSON.stringify([Number(zoneRaw)])
          : "[2]";

  const moduleHeader = searchParams.get("moduleId")?.trim() || "3";
  const locale = searchParams.get("locale") ?? "ar";

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    zoneId,
    moduleId: moduleHeader,
    "X-localization": locale,
  };

  const lat = searchParams.get("latitude") ?? searchParams.get("lat");
  const lng = searchParams.get("longitude") ?? searchParams.get("lng");
  if (lat != null && lat !== "") headers.latitude = String(lat);
  if (lng != null && lng !== "") headers.longitude = String(lng);

  const targetUrl = `${API_ROOT}/stores/search?${forward.toString()}`;

  try {
    const response = await fetch(targetUrl, { headers, cache: "no-store" });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(err, { status: response.status });
    }
    return NextResponse.json(await response.json());
  } catch (err) {
    console.error("[api/stores/search]", err);
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
