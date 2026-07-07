"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";
import { updateProfile } from "@/features/profile/actions/profile.actions";

export function PhotoConfirmClient() {
    const router = useRouter();
    const { draft, consumePendingPhoto, setImagePreview } = useProfileEdit();
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

    const adjustZoom = (delta: number) => {
        setZoom((prev) => Math.min(3, Math.max(1, Number((prev + delta).toFixed(1)))));
    };

    const handleSave = async () => {
        if (!photoSrc) return;

        setIsSaving(true);
        setError(null);

        try {
            const file = new File([photoSrc], "profile.jpg", { type: "image/jpeg" });

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
            setImagePreview(result.user?.image ?? previewUrl);

            router.refresh();
            router.replace("/profile/edit");
        } catch {
            setError(PROFILE_STRINGS.updateError);
        } finally {
            setIsSaving(false);
        }
    };

    if (!photoSrc) return null;

    return (
        <ProfileSubpageShell
            title={PROFILE_STRINGS.photoTitle}
            footer={<PrimaryButton onClick={handleSave} disabled={isSaving}>{PROFILE_STRINGS.save}</PrimaryButton>}
        >
            <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 sm:max-w-2xl sm:gap-8 lg:max-w-3xl">
                <div className="relative aspect-square w-full max-w-48 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 sm:max-w-56 md:max-w-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photoSrc}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-200"
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>

                <div className="flex w-full max-w-sm items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => adjustZoom(-0.1)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#111B18] transition-colors active:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:active:bg-gray-700 sm:h-12 sm:w-12"
                        aria-label="تصغير"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="min-w-0 flex-1 accent-[#30913F]"
                        aria-label="تكبير الصورة"
                    />
                    <button
                        type="button"
                        onClick={() => adjustZoom(0.1)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#30913F] text-white transition-colors active:bg-[#267332] sm:h-12 sm:w-12"
                        aria-label="تكبير"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-full max-w-2xl text-start">
                    <p className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100 sm:text-[15px]">
                        {PROFILE_STRINGS.photoGuidanceTitle}
                    </p>
                    <ul className="space-y-2 text-[14px] leading-relaxed text-gray-700 dark:text-gray-400 sm:text-[15px]">
                        <li>• {PROFILE_STRINGS.photoGuidance1}</li>
                        <li>• {PROFILE_STRINGS.photoGuidance2}</li>
                    </ul>
                </div>

                {error && (
                    <p className="w-full text-center text-[13px] text-red-600 dark:text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </ProfileSubpageShell>
    );
}
