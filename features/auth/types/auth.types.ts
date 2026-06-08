// ── User ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: number;
    f_name: string;
    l_name: string;
    name: string;
    phone: string;
    email: string | null;
    is_phone_verified: 0 | 1;
    wallet_balance: number;
    loyalty_point: number;
    ref_code: string | null;
    status: 0 | 1;
}

// ── Send OTP ─────────────────────────────────────────────────────────────────

export interface SendOtpRequest {
    phone: string;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
    /** true = new SMS sent, false = still within cooldown (use existing code) */
    otp_sent: boolean;
    /** seconds the client must wait before requesting a new OTP */
    cooldown_seconds: number;
    /** seconds until the current OTP expires */
    expires_in_seconds: number;
    phone: string;
    /** only present when otp_sent=false (still cooling down) */
    retry_after_seconds?: number;
}

// ── Verify OTP ───────────────────────────────────────────────────────────────

export interface VerifyOtpRequest {
    phone: string;
    otp: string;
}

/** Returned when the phone is already registered → go to Home */
export interface VerifyOtpExistedResponse {
    success: true;
    is_existed: true;
    token: string;
    token_type: "Bearer";
    phone: string;
    user: AuthUser;
}

/** Returned when the phone is new → go to Create Account */
export interface VerifyOtpNewResponse {
    success: true;
    is_existed: false;
    phone: string;
    /** short-lived signed token proving OTP ownership – required for /register */
    registration_token: string;
    expires_in_seconds: number;
}

export type VerifyOtpResponse = VerifyOtpExistedResponse | VerifyOtpNewResponse;

// ── Register ─────────────────────────────────────────────────────────────────

export interface RegisterRequest {
    name: string;
    email?: string;
    phone: string;
    registration_token: string;
}

export interface RegisterResponse {
    success: boolean;
    token: string;
    token_type: "Bearer";
    phone: string;
    user: AuthUser;
}

// ── Guest ─────────────────────────────────────────────────────────────────────

export interface GuestRequestResponse {
    message: string;
    guest_id: number;
}



// ── Hook State ────────────────────────────────────────────────────────────────

/** Everything the AuthFlowPage needs to drive all four screens */
export interface AuthFlowState {
    step: AuthStep;
    phone: string;
    registrationToken: string;
    guestId: string | null;
    isLoading: boolean;
    error: string | null;
}

export type AuthStep = "welcome" | "enter-phone" | "otp" | "create";

// ── Cookie Keys (centralised so nothing is magic-stringed elsewhere) ──────────

export const COOKIE_KEYS = {
    ACCESS_TOKEN: "access_token",
    USER: "auth_user",
    GUEST_ID: "guest_id",
} as const;