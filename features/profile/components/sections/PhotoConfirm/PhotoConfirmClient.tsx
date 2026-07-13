"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { ProfilePhotoCrop } from "@/features/profile/components/shared/ProfilePhotoCrop";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";
import { updateProfile } from "@/features/profile/actions/profile.actions";
import { cropProfileImage } from "@/features/profile/lib/crop-image";

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export function PhotoConfirmClient() {
    const router = useRouter();
    const { draft, consumePendingPhoto, setImagePreview, setPendingPhotoFile } =
        useProfileEdit();
    const [photoSrc, setPhotoSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1.2);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const pending = consumePendingPhoto();
        if (pending) {
            setPhotoSrc(pending);
            setReady(true);
            return;
        }
        router.replace("/profile/edit");
    }, [consumePendingPhoto, router]);

    const handleSave = async () => {
        if (!photoSrc || isSaving) return;

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

            const previewUrl = URL.createObjectURL(file);
            setPendingPhotoFile(null);
            setImagePreview(result.user?.image ?? previewUrl);

            router.refresh();
            router.replace("/profile/edit");
        } catch {
            // Fallback: persist cropped file on the draft if upload fails mid-flow
            try {
                const file = await dataUrlToFile(photoSrc, "profile.jpg");
                setPendingPhotoFile(file);
            } catch {
                /* ignore */
            }
            setError(PROFILE_STRINGS.updateError);
        } finally {
            setIsSaving(false);
        }
    };

    if (!ready || !photoSrc) {
        return (
            <ProfileSubpageShell title={PROFILE_STRINGS.photoTitle}>
                <div className="flex min-h-[40vh] items-center justify-center">
                    <p className="text-sm text-[#707784] dark:text-gray-400">
                        جاري تحميل الصورة...
                    </p>
                </div>
            </ProfileSubpageShell>
        );
    }

    return (
        <ProfileSubpageShell
            title={PROFILE_STRINGS.photoTitle}
            footer={
                <PrimaryButton onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "جاري الحفظ..." : PROFILE_STRINGS.save}
                </PrimaryButton>
            }
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
