export function offerFetchHeaders(moduleId = "3", locale = "en"): HeadersInit {
    return {
        Accept: "application/json",
        "X-Localization": locale,
        zoneId: process.env.ZONE_ID!,
        moduleId,
    };
}
