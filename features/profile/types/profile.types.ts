import type { AuthUser, UserGender } from "@/features/auth/types/auth.types";

export interface UpdateProfilePayload {
    f_name: string;
    l_name: string;
    email: string;
    gender?: UserGender | null;
}

export interface UpdateProfileResult {
    success: boolean;
    message: string;
    user?: AuthUser;
}

export interface DeleteAccountResult {
    success: boolean;
    message: string;
}

export type ProfileEditDraft = {
    fullName: string;
    email: string;
    gender: UserGender | null;
    imagePreview: string | null;
    pendingPhotoDataUrl: string | null;
    pendingPhotoFile: File | null;
};
