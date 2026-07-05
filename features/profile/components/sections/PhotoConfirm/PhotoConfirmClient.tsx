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
                    f_name: draft.fullName,
                    l_name: "",
                    email: draft.email.trim(),
                    gender: draft.gender,
                },
                file,
            );

            if (!result.success) {
                setError(result.message);
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
            <div className="flex flex-col items-center gap-6">
                <div className="relative h-56 w-56 overflow-hidden rounded-full bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photoSrc}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-200"
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>

                <div className="flex w-full max-w-xs items-center gap-3">
                    <button
                        type="button"
                        onClick={() => adjustZoom(-0.1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
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
                        className="flex-1 accent-gray-900"
                    />
                    <button
                        type="button"
                        onClick={() => adjustZoom(0.1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white"
                        aria-label="تكبير"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-full text-start">
                    <p className="mb-3 text-[14px] font-bold text-gray-900">
                        {PROFILE_STRINGS.photoGuidanceTitle}
                    </p>
                    <ul className="space-y-2 text-[14px] leading-relaxed text-gray-700">
                        <li>• {PROFILE_STRINGS.photoGuidance1}</li>
                        <li>• {PROFILE_STRINGS.photoGuidance2}</li>
                    </ul>
                </div>

                {error && <p className="text-[13px] text-red-600">{error}</p>}
            </div>
        </ProfileSubpageShell>
    );
}
