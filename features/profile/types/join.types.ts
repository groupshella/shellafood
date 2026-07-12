// ── Shared ────────────────────────────────────────────────────────────────────

export interface JoinActionResult {
    success: boolean;
    message: string;
    fieldErrors?: Partial<Record<string, string>>;
    alreadyRegistered?: boolean;
}

// ── Delivery-Man ──────────────────────────────────────────────────────────────

export type IdentityType = "passport" | "driving_license";
export type EarningType = "0" | "1"; // 0 = freelancer, 1 = salary

export interface Zone {
    id: number | string;
    name: string;
}

export interface Vehicle {
    id: number | string;
    type: string;
}

export interface CheckRegistrationResult {
    isRegistered: boolean;
    message?: string;
}

export interface RegisterDriverPayload {
    f_name: string;
    email: string;
    phone: string;
    password: string;
    zone_id: string;
    vehicle_id: string;
    earning: EarningType;
    identity_type: IdentityType;
    identity_number: string;
    identity_images: File[];
    driving_license_images: File[];
    driver_license_images: File[];
}

// ── Delegate (Voucher Rep) ────────────────────────────────────────────────────

export type DelegateStatus = "pending" | "approved" | "rejected" | "none";

export interface DelegateStatusResult {
    status: DelegateStatus;
    message?: string;
}

export interface RegisterDelegatePayload {
    user_id: string;
    f_name: string;
    l_name: string;
    mobile: string;
    id_photo: File;
    id_photo_name: string;
}
