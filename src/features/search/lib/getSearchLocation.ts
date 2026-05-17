const LOCATION_COOKIE_KEY = "user_location";

/** Reads `user_location` cookie set by DeliveryAddressHero geolocation. */
export function getSearchLocationFromCookie(): { lat: string; lng: string } | null {
	if (typeof document === "undefined") return null;

	const match = document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${LOCATION_COOKIE_KEY}=`));

	if (!match) return null;

	const value = decodeURIComponent(match.split("=")[1]);
	const [lat, lng] = value.split(",").map(Number);

	if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

	return { lat: String(lat), lng: String(lng) };
}
