"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { AuthUser, UserGender } from "@/features/auth/types/auth.types";
import type { ProfileEditDraft } from "@/features/profile/types/profile.types";
import { resolveProfileImageUrl } from "@/features/profile/lib/profile.lib";

const PENDING_PHOTO_KEY = "profile_pending_photo";

interface ProfileEditContextValue {
    draft: ProfileEditDraft;
    setFullName: (value: string) => void;
    setEmail: (value: string) => void;
    setGender: (value: UserGender) => void;
    setImagePreview: (value: string | null) => void;
    setPendingPhotoFile: (file: File | null) => void;
    setPendingPhoto: (dataUrl: string) => void;
    consumePendingPhoto: () => string | null;
    resetFromUser: (user: AuthUser) => void;
}

const ProfileEditContext = createContext<ProfileEditContextValue | null>(null);

function draftFromUser(user: AuthUser): ProfileEditDraft {
    return {
        fullName: `${user.f_name} ${user.l_name}`.trim(),
        email: user.email ?? "",
        gender: user.gender ?? null,
        imagePreview: resolveProfileImageUrl(user.image),
        pendingPhotoDataUrl: null,
        pendingPhotoFile: null,
    };
}

export function ProfileEditProvider({
    user,
    children,
}: {
    user: AuthUser;
    children: ReactNode;
}) {
    const [draft, setDraft] = useState<ProfileEditDraft>(() => draftFromUser(user));

    const setFullName = useCallback((value: string) => {
        setDraft((prev) => ({ ...prev, fullName: value }));
    }, []);

    const setEmail = useCallback((value: string) => {
        setDraft((prev) => ({ ...prev, email: value }));
    }, []);

    const setGender = useCallback((value: UserGender) => {
        setDraft((prev) => ({ ...prev, gender: value }));
    }, []);

    const setImagePreview = useCallback((value: string | null) => {
        setDraft((prev) => ({ ...prev, imagePreview: resolveProfileImageUrl(value) }));
    }, []);

    const setPendingPhotoFile = useCallback((file: File | null) => {
        setDraft((prev) => ({ ...prev, pendingPhotoFile: file }));
    }, []);

    const setPendingPhoto = useCallback((dataUrl: string) => {
        sessionStorage.setItem(PENDING_PHOTO_KEY, dataUrl);
        setDraft((prev) => ({ ...prev, pendingPhotoDataUrl: dataUrl }));
    }, []);

    const consumePendingPhoto = useCallback(() => {
        const stored = sessionStorage.getItem(PENDING_PHOTO_KEY);
        sessionStorage.removeItem(PENDING_PHOTO_KEY);
        return stored;
    }, []);

    const resetFromUser = useCallback((nextUser: AuthUser) => {
        setDraft(draftFromUser(nextUser));
    }, []);

    const value = useMemo(
        () => ({
            draft,
            setFullName,
            setEmail,
            setGender,
            setImagePreview,
            setPendingPhotoFile,
            setPendingPhoto,
            consumePendingPhoto,
            resetFromUser,
        }),
        [draft, setFullName, setEmail, setGender, setImagePreview, setPendingPhotoFile, setPendingPhoto, consumePendingPhoto, resetFromUser],
    );

    return <ProfileEditContext.Provider value={value}>{children}</ProfileEditContext.Provider>;
}

export function useProfileEdit() {
    const ctx = useContext(ProfileEditContext);
    if (!ctx) throw new Error("useProfileEdit must be used within ProfileEditProvider");
    return ctx;
}
