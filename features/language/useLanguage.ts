"use client";

import { useCallback, useEffect, useState } from "react";

export type AppLocale = "ar" | "en";

const STORAGE_KEY = "shellafood-lang";
const CHANGE_EVENT = "shellafood:lang";
const DEFAULT: AppLocale = "ar";

function readStored(): AppLocale {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === "ar" || v === "en") return v;
    } catch {
        // localStorage unavailable
    }
    return DEFAULT;
}

function applyToDOM(locale: AppLocale) {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

/** Keep a cookie in sync so server actions/API can read the locale. */
function writeLocaleCookie(locale: AppLocale) {
    try {
        const maxAge = 60 * 60 * 24 * 365;
        document.cookie = `shellafood-lang=${locale};path=/;max-age=${maxAge};samesite=lax`;
        document.cookie = `app_locale=${locale};path=/;max-age=${maxAge};samesite=lax`;
    } catch {
        // cookies unavailable
    }
}

/**
 * Global language hook — works exactly like dark-mode:
 * - Reads from localStorage on mount
 * - Writes back to localStorage + updates html[lang/dir]
 * - Fires a custom event so every useLanguage instance on the same
 *   page stays in sync without needing a Context provider
 * - Also handles cross-tab sync via the native `storage` event
 */
export function useLanguage() {
    // Start with the default to avoid hydration mismatch; sync on mount
    const [locale, setLocale] = useState<AppLocale>(DEFAULT);

    useEffect(() => {
        const stored = readStored();
        setLocale(stored);
        applyToDOM(stored);
        writeLocaleCookie(stored);

        // Same-page sync (other useLanguage instances)
        const onCustom = (e: Event) => {
            const next = (e as CustomEvent<AppLocale>).detail;
            setLocale(next);
        };

        // Cross-tab sync
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && (e.newValue === "ar" || e.newValue === "en")) {
                setLocale(e.newValue);
                applyToDOM(e.newValue);
            }
        };

        window.addEventListener(CHANGE_EVENT, onCustom);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener(CHANGE_EVENT, onCustom);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const setLanguage = useCallback((next: AppLocale) => {
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // localStorage unavailable
        }
        writeLocaleCookie(next);
        applyToDOM(next);
        setLocale(next);
        window.dispatchEvent(new CustomEvent<AppLocale>(CHANGE_EVENT, { detail: next }));
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(locale === "ar" ? "en" : "ar");
    }, [locale, setLanguage]);

    return {
        locale,
        isArabic: locale === "ar",
        setLanguage,
        toggleLanguage,
    } as const;
}
