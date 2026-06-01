import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/features/(actors)/auth/constants/auth.constants";

const API_ROOT = `${BASE_URL}/api/v1`;

/** Proxies Laravel `GET .../stores/top-offer-near-me`. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forward = new URLSearchParams(searchParams);





  const headers: Record<string, string> = {
    "zoneId": "[2]",
    "moduleId": "3",

    "Content-Type": "application/json"
  };

  const targetUrl = `${API_ROOT}/stores/top-offer-near-me?${forward.toString()}`;

  try {
    const response = await fetch(targetUrl, { headers, cache: "no-store" });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(err, { status: response.status });
    }
    return NextResponse.json(await response.json());
  } catch (err) {
    console.error("[api/stores/top-offer]", err);
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
