export function offerFetchHeaders(moduleId = "3"): HeadersInit {
    return {
        Accept: "application/json",
        "X-Localization": "ar",
        zoneId: process.env.ZONE_ID!,
        moduleId,
    };
}
