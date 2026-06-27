// features/auth/hooks/useAuth.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    AuthStep,
    GuestRequestResponse,
    RegisterRequest,
    RegisterResponse,
    SendOtpResponse,
    VerifyOtpExistedResponse,
    VerifyOtpNewResponse,
    VerifyOtpResponse,
} from "@/features/auth/types/auth.types";
import { saveSession, saveGuestId, getGuestId } from "@/features/auth/lib/auth.lib";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

export interface UseAuthReturn {
    step: AuthStep;
    phone: string;
    registrationToken: string;
    isLoading: boolean;
    error: string | null;
    cooldownSeconds: number;
    expiresInSeconds: number;

    handleSendOtp: (phone: string) => Promise<void>;
    handleVerifyOtp: (otp: string) => Promise<void>;
    handleRegister: (params: { name: string; email?: string; referralToken?: string; refCode?: string }) => Promise<void>;
    handleGuest: () => Promise<void>;
    handleResendOtp: () => Promise<SendOtpResponse | undefined>;
    clearError: () => void;
    goBack: () => void;
    goToEnterPhone: () => void;
}

// ── Shared fetch helper ───────────────────────────────────────────────────────
// Posts to a Next.js proxy route, unwraps the envelope, and throws on failure.
// Every handler just calls this — no repeated fetch boilerplate.

async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const json = await res.json() as ApiResponse<T>;
    return unwrap(json); // throws ApiError message string on success=false
}

// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
    const router = useRouter();

    const [step, setStep] = useState<AuthStep>("welcome");
    const [phone, setPhone] = useState("");
    const [registrationToken, setRegistrationToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);
    const [expiresInSeconds, setExpiresInSeconds] = useState(0);


    const clearError = useCallback(() => setError(null), []);

    // ── Step 1: Send OTP ──────────────────────────────────────────────────────

    const handleSendOtp = useCallback(async (phoneNumber: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await post<SendOtpResponse>("/api/auth/send-otp", { phone: phoneNumber });

            setCooldownSeconds(data.cooldown_seconds);
            setExpiresInSeconds(data.expires_in_seconds);
            setPhone(phoneNumber);
            setStep("otp");
        } catch (err) {
            setError(err as string);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────

    const handleVerifyOtp = useCallback(async (otp: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await post<VerifyOtpResponse>("/api/auth/verify-otp", { phone, otp });

            if (data.is_existed) {
                const existed = data as VerifyOtpExistedResponse;
                await saveSession(existed.token, existed.user);
                router.replace("/home");
            } else {
                const newUser = data as VerifyOtpNewResponse;
                setRegistrationToken(newUser.registration_token);
                setStep("create");
            }
        } catch (err) {
            setError(err as string);
        } finally {
            setIsLoading(false);
        }
    }, [phone]);

    // ── Step 3: Register ──────────────────────────────────────────────────────

    const handleRegister = useCallback(async ({
        name, email
    }: {
        name: string;
        email?: string;
        referralToken?: string;
        refCode?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const payload: RegisterRequest = {
                name,
                phone: phone,
                registration_token: registrationToken,
                ...(email && { email }),

            };

            const data = await post<RegisterResponse>(
                "/api/auth/register",
                payload
            );

            await saveSession(data.token, data.user);
            router.replace("/addresses/add");
        } catch (err) {
            setError(err as string);
        } finally {
            setIsLoading(false);
        }
    }, [phone, registrationToken]);

    // ── Guest ─────────────────────────────────────────────────────────────────

    const handleGuest = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await post<GuestRequestResponse>(
                "/api/auth/guest",
                {}
            );
            await saveGuestId(String(data.guest_id));
            router.replace("/home");
        } catch (err) {
            setError(err as string);
            router.replace("/home");
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // ── Resend OTP ────────────────────────────────────────────────────────────
    // Not wrapped in isLoading — the OTP screen manages its own resend state.

    const handleResendOtp = useCallback(async () => {
        setError(null);

        try {
            return await post<SendOtpResponse>("/api/auth/send-otp", { phone });
        } catch (err) {
            setError(err as string);
        }
    }, [phone]);

    // ── Back navigation ───────────────────────────────────────────────────────

    const goBack = useCallback(() => {
        setError(null);
        const prev: Partial<Record<AuthStep, AuthStep>> = {
            "enter-phone": "welcome",
            "otp": "enter-phone",
            "create": "enter-phone",
        };
        const next = prev[step];
        if (next) setStep(next);
    }, [step]);

    const goToEnterPhone = useCallback(() => {
        setError(null);
        setStep("enter-phone");
    }, []);

    return {
        step,
        phone,
        registrationToken,
        isLoading,
        error,
        cooldownSeconds,
        expiresInSeconds,
        handleSendOtp,
        handleVerifyOtp,
        handleRegister,
        handleGuest,
        handleResendOtp,
        clearError,
        goBack,
        goToEnterPhone,
    };
}