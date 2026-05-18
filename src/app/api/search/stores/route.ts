import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/features/auth/constants/auth.constants";

const API_ROOT = `${BASE_URL}/api/v1`;

/** Proxies Laravel `GET .../stores/search` for the search feature. */
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const name = searchParams.get("name")?.trim();
	if (!name) {
		return NextResponse.json({ error: "Search name is required" }, { status: 400 });
	}

	const forward = new URLSearchParams(searchParams);
	for (const key of ["zoneId", "moduleId", "longitude", "latitude", "lang", "locale"]) {
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

	const locale = searchParams.get("lang") ?? searchParams.get("locale") ?? "ar";

	const headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
		zoneId,
		...(searchParams.get("moduleId")?.trim() && { moduleId: searchParams.get("moduleId")!.trim() }),
		...(searchParams.get("longitude")?.trim() && { longitude: searchParams.get("longitude")!.trim() }),
		...(searchParams.get("latitude")?.trim() && { latitude: searchParams.get("latitude")!.trim() }),
		"X-localization": locale,
		"Accept-Language": locale,
	};

	const targetUrl = `${API_ROOT}/stores/search?${forward.toString()}`;

	try {
		const response = await fetch(targetUrl, { method: "GET", headers, cache: "no-store" });
		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			return NextResponse.json(err, { status: response.status });
		}
		return NextResponse.json(await response.json());
	} catch (err) {
		console.error("[api/search/stores]", err);
		return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
	}
}
