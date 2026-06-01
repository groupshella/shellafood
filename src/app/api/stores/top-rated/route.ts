import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/features/(actors)/auth/constants/auth.constants";

const API_ROOT = `${BASE_URL}/api/v1`;

/** Proxies Laravel `GET .../stores/top-rated`. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forward = new URLSearchParams(searchParams);


  const headers: Record<string, string> = {
    "zoneId": "[2]",
    "moduleId": "3",
    "longitude": "46.5444937",
    "latitude": "24.567752",
    "Content-Type": "application/json"
  };

  const targetUrl = `${API_ROOT}/stores/top-rated?${forward.toString()}`;

  try {
    const response = await fetch(targetUrl, { headers, cache: "no-store" });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(err, { status: response.status });
    }
    return NextResponse.json(await response.json());
  } catch (err) {
    console.error("[api/stores/top-rated]", err);
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
