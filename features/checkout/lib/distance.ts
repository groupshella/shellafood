const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export interface GeoPoint {
    latitude: number;
    longitude: number;
}

/**
 * Great-circle distance in km between two coordinates (Haversine).
 * Used for shipping estimates when no road-distance API is available.
 */
export function calculateDistanceKm(from: GeoPoint, to: GeoPoint): number {
    if (
        !Number.isFinite(from.latitude) ||
        !Number.isFinite(from.longitude) ||
        !Number.isFinite(to.latitude) ||
        !Number.isFinite(to.longitude)
    ) {
        return 0;
    }

    const dLat = toRadians(to.latitude - from.latitude);
    const dLng = toRadians(to.longitude - from.longitude);
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

/** Round distance for display / payload (1 decimal km). */
export function roundDistanceKm(km: number): number {
    return Math.round(km * 10) / 10;
}
