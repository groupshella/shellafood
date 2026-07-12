// features/auth/hooks/useAuth.ts
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AuthStep,
    AuthUser,
    ForgotPasswordResponse,
    GuestRequestResponse,
    LoginResponse,
    OtpFlow,
    OtpOrigin,
    RegisterResponse,
    ResetPasswordResponse,
    SendOtpAgainResponse,
    VerifyPhoneResponse,
    VerifyTokenResponse,
    isLoginSuccess,
} from "@/features/auth/types/auth.types";
import { saveGuestId, saveSession, getErrorMessage, toLocalPhone } from "@/features/auth/lib/auth.lib";
import { useLanguage, type AppLocale } from "@/features/language/useLanguage";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

export interface UseAuthReturn {
    step: AuthStep;
    phone: string;
    otpFlow: OtpFlow;
    isLoading: boolean;
    error: string | null;
    infoMessage: string | null;
    cooldownSeconds: number;
    prefillPhone: string;

    handleLogin: (phone: string, password: string) => Promise<void>;
    handleRegister: (data: {
        fullName: string;
        phone: string;
        email?: string;
        password: string;
        confirmPassword: string;
    }) => Promise<void>;
    handleVerifyOtp: (otp: string) => Promise<void>;
    handleResendOtp: () => Promise<{ retry_after_seconds?: number } | undefined>;
    handleForgotPasswordSubmit: (phone: string) => Promise<void>;
    handleResetPassword: (password: string, confirmPassword: string) => Promise<void>;
    handleGuest: () => Promise<void>;

    clearError: () => void;
    goBack: () => void;
    goToRegister: () => void;
    goToForgotPassword: () => void;
    goToLogin: () => void;
    goToLoginWithPhone: (phone: string) => void;
    goToForgotPasswordWithPhone: (phone: string) => void;
}

// ── Shared fetch helpers ───────────────────────────────────────────────────────
// Post/put to a Next.js proxy route, unwrap the envelope, throw on failure.

async function post<T>(path: string, body: unknown, locale: AppLocale): Promise<T> {
    const res = await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-localization": locale,
        },
        body: JSON.stringify(body),
    });
    const json = (await res.json()) as ApiResponse<T>;
    return unwrap(json); // throws an error message string on success=false
}

async function put<T>(path: string, body: unknown, locale: AppLocale): Promise<T> {
    const res = await fetch(path, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-localization": locale,
        },
        body: JSON.stringify(body),
    });
    const json = (await res.json()) as ApiResponse<T>;
    return unwrap(json);
}

const DEFAULT_COOLDOWN = 60;

function authLog(event: string, payload?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "production") return;
    console.info(`[AUTH_FLOW][${event}]`, payload ?? "");
}

// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
    const router = useRouter();
    const { isArabic, locale } = useLanguage();

    const [step, setStep] = useState<AuthStep>("login");
    const [phone, setPhone] = useState("");
    const [otpFlow, setOtpFlow] = useState<OtpFlow>("registration");
    const [otpOrigin, setOtpOrigin] = useState<OtpOrigin>("login-pending");
    const [resetToken, setResetToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [cooldownSeconds, setCooldownSeconds] = useState(DEFAULT_COOLDOWN);
    const [prefillPhone, setPrefillPhone] = useState("");

    const clearError = useCallback(() => setError(null), []);

    // ── Login (password) ────────────────────────────────────────────────────

    const handleLogin = useCallback(async (phoneNumber: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            authLog("LOGIN_ATTEMPT", { phone: phoneNumber });
            const data = await post<LoginResponse>("/api/auth/login", {
                phone: phoneNumber,
                password,
            }, locale);

            if (isLoginSuccess(data)) {
                authLog("LOGIN_SUCCESS_PASSWORD", {
                    userId: data.user.id,
                    cart_transferred: data.cart_transferred,
                    items_transferred: data.items_transferred,
                });
                await saveSession(data.token, data.user as AuthUser);
                router.replace("/home");
                return;
            }

            authLog("LOGIN_PENDING_VERIFICATION", {
                phone: data.phone,
                retry_after_seconds: data.retry_after_seconds,
                otp_sent: data.otp_sent,
            });
            setPhone(data.phone);
            setOtpFlow("registration");
            setOtpOrigin("login-pending");
            setCooldownSeconds(data.retry_after_seconds ?? DEFAULT_COOLDOWN);
            setStep("otp");
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
        } finally {
            setIsLoading(false);
        }
    }, [router, locale, isArabic]);

    // ── Register ─────────────────────────────────────────────────────────────

    const handleRegister = useCallback(async ({
        fullName,
        phone: phoneNumber,
        email,
        password,
        confirmPassword,
    }: {
        fullName: string;
        phone: string;
        email?: string;
        password: string;
        confirmPassword: string;
    }) => {
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError(
                isArabic
                    ? "كلمتا المرور غير متطابقتين"
                    : "Passwords do not match",
            );
            setIsLoading(false);
            return;
        }

        try {
            const trimmedName = fullName.trim();
            const [firstName, ...rest] = trimmedName.split(" ");

            const data = await post<RegisterResponse>("/api/auth/register", {
                name: trimmedName,
                f_name: firstName,
                l_name: rest.join(" ") || firstName,
                phone: phoneNumber,
                password,
                confirm_password: confirmPassword,
                ...(email && { email }),
            }, locale);

            authLog("REGISTER_OTP_REQUIRED", {
                phone: data.phone,
                otp_sent: data.otp_sent,
                retry_after_seconds: data.retry_after_seconds,
            });
            setPhone(data.phone);
            setOtpFlow("registration");
            setOtpOrigin("register");
            setCooldownSeconds(data.retry_after_seconds ?? DEFAULT_COOLDOWN);
            setStep("otp");
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
        } finally {
            setIsLoading(false);
        }
    }, [locale, isArabic]);

    // ── Verify OTP (branches on otpFlow) ────────────────────────────────────

    const handleVerifyOtp = useCallback(async (otp: string) => {
        setIsLoading(true);
        setError(null);

        try {
            if (otpFlow === "registration") {
                await post<VerifyPhoneResponse>("/api/auth/verify-phone", { phone, otp }, locale);
                authLog("VERIFY_REGISTRATION_SUCCESS", { phone });

                if (otpOrigin === "register") {
                    setStep("register-success");
                } else {
                    // login-pending: verification done, user must log in normally now.
                    setInfoMessage(
                        isArabic
                            ? "تم تفعيل رقم هاتفك، يمكنك تسجيل الدخول الآن"
                            : "Your phone number is verified. You can sign in now",
                    );
                    setStep("login");
                }
            } else {
                const data = await post<VerifyTokenResponse>("/api/auth/verify-token", {
                    phone,
                    reset_token: otp,
                }, locale);
                authLog("VERIFY_RESET_OTP_SUCCESS", { phone: data.phone });
                setResetToken(otp);
                setPhone(data.phone);
                setStep("new-password");
            }
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
        } finally {
            setIsLoading(false);
        }
    }, [otpFlow, otpOrigin, phone, locale, isArabic]);

    // ── Resend OTP (branches on otpFlow) ────────────────────────────────────

    const handleResendOtp = useCallback(async () => {
        setError(null);

        try {
            if (otpFlow === "registration") {
                const data = await post<SendOtpAgainResponse>("/api/auth/send-otp-again", {
                    phone,
                    otp_flow: "registration",
                }, locale);
                return { retry_after_seconds: data.retry_after_seconds ?? DEFAULT_COOLDOWN };
            }

            // forgot_password has no dedicated resend route — re-call forgot-password.
            const data = await post<ForgotPasswordResponse>("/api/auth/forgot-password", { phone }, locale);
            return { retry_after_seconds: data.retry_after_seconds ?? DEFAULT_COOLDOWN };
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
            return undefined;
        }
    }, [otpFlow, phone, locale, isArabic]);

    // ── Forgot password: request OTP ────────────────────────────────────────

    const handleForgotPasswordSubmit = useCallback(async (phoneNumber: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await post<ForgotPasswordResponse>("/api/auth/forgot-password", {
                phone: phoneNumber,
            }, locale);

            authLog("FORGOT_PASSWORD_OTP_SENT", {
                phone: data.phone,
                retry_after_seconds: data.retry_after_seconds,
            });

            setPhone(data.phone);
            setOtpFlow("forgot_password");
            setOtpOrigin("forgot-password");
            setCooldownSeconds(data.retry_after_seconds ?? DEFAULT_COOLDOWN);
            setStep("otp");
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
        } finally {
            setIsLoading(false);
        }
    }, [locale, isArabic]);

    // ── Reset password ───────────────────────────────────────────────────────

    const handleResetPassword = useCallback(async (password: string, confirmPassword: string) => {
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError(
                isArabic
                    ? "كلمتا المرور غير متطابقتين"
                    : "Passwords do not match",
            );
            setIsLoading(false);
            return;
        }

        try {
            await put<ResetPasswordResponse>("/api/auth/reset-password", {
                phone,
                reset_token: resetToken,
                password,
                confirm_password: confirmPassword,
            }, locale);

            authLog("RESET_PASSWORD_SUCCESS", { phone });

            setStep("reset-success");
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
        } finally {
            setIsLoading(false);
        }
    }, [phone, resetToken, locale, isArabic]);

    // ── Guest ─────────────────────────────────────────────────────────────────

    const handleGuest = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await post<GuestRequestResponse>("/api/auth/guest", {}, locale);
            await saveGuestId(String(data.guest_id));
            router.replace("/home");
        } catch (err) {
            setError(getErrorMessage(err, isArabic));
            router.replace("/home");
        } finally {
            setIsLoading(false);
        }
    }, [router, locale, isArabic]);

    // ── Navigation ────────────────────────────────────────────────────────────

    const goToRegister = useCallback(() => {
        setError(null);
        setInfoMessage(null);
        setStep("register");
    }, []);

    const goToForgotPassword = useCallback(() => {
        setError(null);
        setInfoMessage(null);
        setStep("forgot-phone");
    }, []);

    const goToLogin = useCallback(() => {
        setError(null);
        setInfoMessage(null);
        setStep("login");
    }, []);

    const goToLoginWithPhone = useCallback((phoneNumber: string) => {
        setError(null);
        setInfoMessage(null);
        setPrefillPhone(toLocalPhone(phoneNumber));
        setStep("login");
    }, []);

    const goToForgotPasswordWithPhone = useCallback((phoneNumber: string) => {
        setError(null);
        setInfoMessage(null);
        setPrefillPhone(toLocalPhone(phoneNumber));
        setStep("forgot-phone");
    }, []);

    const goBack = useCallback(() => {
        setError(null);

        if (step === "otp") {
            setStep(
                otpOrigin === "register"
                    ? "register"
                    : otpOrigin === "forgot-password"
                        ? "forgot-phone"
                        : "login",
            );
            return;
        }

        const prev: Partial<Record<AuthStep, AuthStep>> = {
            register: "login",
            "forgot-phone": "login",
            "new-password": "otp",
        };
        const next = prev[step];
        if (next) setStep(next);
    }, [step, otpOrigin]);

    return {
        step,
        phone,
        otpFlow,
        isLoading,
        error,
        infoMessage,
        cooldownSeconds,
        prefillPhone,
        handleLogin,
        handleRegister,
        handleVerifyOtp,
        handleResendOtp,
        handleForgotPasswordSubmit,
        handleResetPassword,
        handleGuest,
        clearError,
        goBack,
        goToRegister,
        goToForgotPassword,
        goToLogin,
        goToLoginWithPhone,
        goToForgotPasswordWithPhone,
    };
}
