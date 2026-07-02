// features/auth/types/auth.types.ts
//
// Rewritten to match the new password-based backend flow:
// login (password) -> OTP only for pending/registration accounts -> home
// register -> OTP (registration) -> login
// forgot-password -> OTP (forgot_password) -> reset-password -> login

// ── User ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: number;
    f_name: string;
    l_name: string;
    name?: string;
    image?: string | null;
    loyalty_point: number;
    wallet_balance: number;
    email: string | null;
    phone: string;
    is_phone_verified: 0 | 1;
    is_email_verified: 0 | 1;
}

// ── Login ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
    phone: string;
    password: string;
}

/** Verified user — server returns a token immediately. No OTP screen. */
export interface LoginSuccessResponse {
    token: string;
    user: AuthUser;
    is_phone_verified: 1;
    is_email_verified: 0 | 1;
    is_personal_info: 0 | 1;
    is_exist_user: boolean;
    login_type: string;
    email: string | null;
    cart_transferred: boolean;
    items_transferred: number;
}

/** Account exists but never finished registration OTP. 403 on the wire. */
export interface LoginPendingResponse {
    verification_required: true;
    otp_flow: "registration";
    phone: string;
    user_exists_pending: true;
    message: string;
    otp_sent: boolean;
    retry_after_seconds?: number;
}

export type LoginResponse = LoginSuccessResponse | LoginPendingResponse;

export function isLoginSuccess(data: LoginResponse): data is LoginSuccessResponse {
    return "token" in data;
}

// ── Register ─────────────────────────────────────────────────────────────────

export interface RegisterRequest {
    name: string;
    f_name: string;
    l_name: string;
    phone: string;
    email?: string;
    password: string;
    confirm_password: string;
}

export interface RegisterResponse {
    verification_required: true;
    otp_flow: "registration";
    phone: string;
    user_exists_pending: false;
    message: string;
    otp_sent?: boolean;
    retry_after_seconds?: number;
    is_phone_verified: 0 | 1;
    is_email_verified: 0 | 1;
    is_personal_info: 0 | 1;
    login_type: string;
}

// ── Verify phone (registration OTP) ─────────────────────────────────────────

export interface VerifyPhoneRequest {
    phone: string;
    otp: string;
}

export interface VerifyPhoneResponse {
    success: boolean;
    message: string;
    otp: string;
    is_phone_verified: 1;
}

// ── Resend OTP — registration flow only ─────────────────────────────────────

export interface SendOtpAgainRequest {
    phone: string;
    otp_flow?: "registration";
}

export interface SendOtpAgainResponse {
    success: boolean;
    message?: string;
    otp_sent?: boolean;
    retry_after_seconds?: number;
}

// ── Forgot password ──────────────────────────────────────────────────────────

export interface ForgotPasswordRequest {
    phone: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    otp_flow: "forgot_password";
    phone: string;
    message: string;
    retry_after_seconds?: number;
}

// ── Verify forgot-password OTP ───────────────────────────────────────────────

export interface VerifyTokenRequest {
    phone: string;
    reset_token: string;
}

export interface VerifyTokenResponse {
    success: boolean;
    message: string;
    otp_flow: "forgot_password";
    phone: string;
}

// ── Reset password ───────────────────────────────────────────────────────────

export interface ResetPasswordRequest {
    phone: string;
    reset_token: string;
    password: string;
    confirm_password: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

// ── Guest ────────────────────────────────────────────────────────────────────

export interface GuestRequestResponse {
    message: string;
    guest_id: number;
}

// ── Errors ───────────────────────────────────────────────────────────────────

export interface AuthApiError {
    code: string;
    message: string;
}

export interface AuthErrorBody {
    errors: AuthApiError[];
}

/** Shared optional fields the backend may return across auth flows. */
export interface AuthFlowMeta {
    verification_required?: boolean;
    otp_flow?: OtpFlow;
    phone?: string;
    user_exists_pending?: boolean;
    otp_sent?: boolean;
    retry_after_seconds?: number;
    is_phone_verified?: 0 | 1;
    is_email_verified?: 0 | 1;
    is_personal_info?: 0 | 1;
    login_type?: string;
    success?: boolean;
    message?: string;
    errors?: AuthApiError[];
    cart_transferred?: boolean;
    items_transferred?: number;
}

// ── Flow state ───────────────────────────────────────────────────────────────

export type OtpFlow = "registration" | "forgot_password";

/** Where the OTP screen was entered from — drives back-navigation & the
 *  "what happens after a successful verify" branch. */
export type OtpOrigin = "login-pending" | "register" | "forgot-password";

export type AuthStep =
    | "login"
    | "register"
    | "otp"
    | "forgot-phone"
    | "new-password"
    | "register-success"
    | "reset-success";

// ── Cookie keys (centralised so nothing is magic-stringed elsewhere) ─────────

export const COOKIE_KEYS = {
    ACCESS_TOKEN: "access_token",
    USER: "auth_user",
    GUEST_ID: "guest_id",
} as const;