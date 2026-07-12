"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { ProfilePhotoCrop } from "@/features/profile/components/shared/ProfilePhotoCrop";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";
import { updateProfile } from "@/features/profile/actions/profile.actions";
import { cropProfileImage } from "@/features/profile/lib/crop-image";
import { useLanguage } from "@/features/language/useLanguage";

export function PhotoConfirmClient() {
    const router = useRouter();
    const { draft, consumePendingPhoto, setImagePreview, setPendingPhotoFile } = useProfileEdit();
    const { isArabic } = useLanguage();
    const [photoSrc, setPhotoSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1.2);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pending = consumePendingPhoto();
        if (pending) {
            setPhotoSrc(pending);
            return;
        }
        router.replace("/profile/edit");
    }, [consumePendingPhoto, router]);

    const handleSave = async () => {
        if (!photoSrc) return;

        setIsSaving(true);
        setError(null);

        try {
            const blob = await cropProfileImage(photoSrc, zoom, 0, 0);
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

            const result = await updateProfile(
                {
                    name: draft.fullName.trim(),
                    email: draft.email.trim(),
                    phone: draft.phone.trim(),
                },
                file,
            );

            if (!result.success) {
                setError(result.fieldErrors?.general ?? result.message);
                return;
            }

            const previewUrl = URL.createObjectURL(blob);
            setPendingPhotoFile(null);
            setImagePreview(result.user?.image ?? previewUrl);

            router.refresh();
            router.replace("/profile/edit");
        } catch {
            setError(isArabic ? "تعذر حفظ التغييرات، حاول مرة أخرى" : "Could not save changes, please try again");
        } finally {
            setIsSaving(false);
        }
    };

    if (!photoSrc) return null;

    return (
        <ProfileSubpageShell
            title={isArabic ? "صورة الملف الشخصي" : "Profile photo"}
            footer={
                <PrimaryButton onClick={handleSave} disabled={isSaving}>
                    {isArabic ? "حفظ" : "Save"}
                </PrimaryButton>
            }
            onBack={() => router.replace("/profile/edit")}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
        >
            <div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-3xl">
                <ProfilePhotoCrop
                    photoSrc={photoSrc}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    error={error}
                />
            </div>
        </ProfileSubpageShell>
    );
}
