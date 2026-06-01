"use client";

import { useCallback, useEffect } from "react";
import { useLanguage } from "@/providers";
import { getBaseUrl } from "@/features/(actors)/auth/constants/auth.constants";

export function useHome(guestId: string) {
    const { language } = useLanguage();

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const requestGuestId = useCallback(async () => {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/auth/guest/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-LANG": language,
            },
        });

        if (!response.ok) return;
        await response.json();
    }, [language]);

    useEffect(() => {
        if (!guestId) {
            requestGuestId();
        }
    }, [guestId, requestGuestId]);

    return { scrollToTop };
}
