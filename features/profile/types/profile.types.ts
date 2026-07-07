import type { AuthUser, UserGender } from "@/features/auth/types/auth.types";

export interface UpdateProfilePayload {
    name: string;
    email: string;
    phone: string;
}

export type ProfileFieldKey = "name" | "email" | "phone" | "image" | "general";

export type ProfileFieldErrors = Partial<Record<ProfileFieldKey, string>>;

export interface UpdateProfileResult {
    success: boolean;
    message: string;
    user?: AuthUser;
    fieldErrors?: ProfileFieldErrors;
}

export interface DeleteAccountResult {
    success: boolean;
    message: string;
}

export type ProfileEditDraft = {
    fullName: string;
    email: string;
    phone: string;
    gender: UserGender | null;
    imagePreview: string | null;
    pendingPhotoDataUrl: string | null;
    pendingPhotoFile: File | null;
};
