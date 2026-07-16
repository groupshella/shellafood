export function offerFetchHeaders(
    moduleId = "3",
    lang: "ar" | "en" = "ar"
): HeadersInit {
    return {
        Accept: "application/json",
        "Accept-Language": lang,
        "X-Localization": lang,
        lang,
        zoneId: process.env.ZONE_ID!,
        moduleId,
    };
}
