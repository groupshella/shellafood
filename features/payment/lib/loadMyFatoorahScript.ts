// features/payment/lib/loadMyFatoorahScript.ts

/**
 * MyFatoorah serves a country-specific script for the LIVE environment,
 * and a single shared script for TEST. Pick the URL based on env vars —
 * never hardcode "live" in source.
 *
 * Docs: https://docs.myfatoorah.com/docs/embedded-payment-v3
 */
const TEST_SCRIPT_URL = "https://demo.myfatoorah.com/payment/v1/session.js";

const LIVE_SCRIPT_URL_BY_COUNTRY: Record<string, string> = {
    SAU: "https://sa.myfatoorah.com/payment/v1/session.js",
    ARE: "https://ae.myfatoorah.com/payment/v1/session.js",
    QAT: "https://qa.myfatoorah.com/payment/v1/session.js",
    EGY: "https://eg.myfatoorah.com/payment/v1/session.js",
    KWT: "https://portal.myfatoorah.com/payment/v1/session.js",
    BHR: "https://portal.myfatoorah.com/payment/v1/session.js",
    JOD: "https://portal.myfatoorah.com/payment/v1/session.js",
    OMN: "https://portal.myfatoorah.com/payment/v1/session.js",
};

function resolveScriptUrl(): string {
    const isTest = process.env.NEXT_PUBLIC_MYFATOORAH_TEST_MODE === "true";
    if (isTest) return TEST_SCRIPT_URL;

    const country = process.env.NEXT_PUBLIC_MYFATOORAH_COUNTRY ?? "SAU";
    return LIVE_SCRIPT_URL_BY_COUNTRY[country] ?? LIVE_SCRIPT_URL_BY_COUNTRY.SAU;
}

let scriptPromise: Promise<void> | null = null;

/**
 * Injects the MyFatoorah <script> tag once and resolves when `window.myfatoorah`
 * is available. Safe to call multiple times — subsequent calls reuse the same
 * in-flight/completed promise.
 */
export function loadMyFatoorahScript(): Promise<void> {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("loadMyFatoorahScript must run in the browser"));
    }

    if (window.myfatoorah) {
        return Promise.resolve();
    }

    if (scriptPromise) {
        return scriptPromise;
    }

    scriptPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            'script[data-myfatoorah-sdk="true"]'
        );

        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Failed to load MyFatoorah SDK")));
            return;
        }

        const script = document.createElement("script");
        script.src = resolveScriptUrl();
        script.async = true;
        script.dataset.myfatoorahSdk = "true";
        script.onload = () => resolve();
        script.onerror = () => {
            scriptPromise = null; // allow retry
            reject(new Error("Failed to load MyFatoorah SDK"));
        };
        document.head.appendChild(script);
    });

    return scriptPromise;
}
