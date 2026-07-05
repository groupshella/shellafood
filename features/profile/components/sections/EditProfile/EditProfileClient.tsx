"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import type { AuthUser, UserGender } from "@/features/auth/types/auth.types";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { ProfileAvatar } from "@/features/profile/components/shared/ProfileAvatar";
import { ProfilePhotoCrop } from "@/features/profile/components/shared/ProfilePhotoCrop";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";
import { updateProfile } from "@/features/profile/actions/profile.actions";
import { cropProfileImage } from "@/features/profile/lib/crop-image";
import {
    footerAboveNavClass,
    inputClassName,
    RequiredMark,
} from "@/features/profile/components/shared/registration/formTokens";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import {
    getGenderLabel,
    splitFullName,
} from "@/features/profile/lib/profile.lib";

type EditView = "form" | "gender" | "photo";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

interface EditProfileClientProps {
    user: AuthUser;
}

const editableInputClass = inputClassName;

function FieldBlock({
    label,
    hint,
    required,
    children,
}: {
    label: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full flex-col items-start gap-1.5">
            {hint ? (
                <div className="flex items-center justify-start gap-1">
                    <span className="text-[14px] font-bold leading-[160%] text-[#111B18]">{label}</span>

                    <span className="text-[12px] font-medium leading-[160%] text-[#555555]">{hint}</span>
                </div>
            ) : (
                <div className="flex items-center justify-start gap-1">
                    <span className="text-[14px] font-bold leading-[160%] text-[#111B18]">{label}</span>
                    {required && <RequiredMark />}
                </div>
            )}
            {children}
        </div>
    );
}

export function EditProfileClient({ user }: EditProfileClientProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { draft, setFullName, setEmail, setGender, setImagePreview, setPendingPhotoFile } =
        useProfileEdit();

    const [view, setView] = useState<EditView>("form");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [genderSelection, setGenderSelection] = useState<UserGender>(draft.gender ?? "male");
    const [photoSrc, setPhotoSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1.2);

    const goToForm = () => {
        setError(null);
        setPhotoSrc(null);
        setZoom(1.2);
        setView("form");
    };

    const handlePhotoPick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!ACCEPTED_PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_BYTES) {
            setError(PROFILE_STRINGS.invalidPhoto);
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onload = () => {
            setPhotoSrc(reader.result as string);
            setZoom(1.2);
            setView("photo");
        };
        reader.readAsDataURL(file);
    };

    const handleSaveForm = async () => {
        if (!draft.fullName.trim() || !draft.email.trim()) {
            setError(PROFILE_STRINGS.requiredField);
            return;
        }

        setIsSaving(true);
        setError(null);

        const { f_name, l_name } = splitFullName(draft.fullName);
        const result = await updateProfile(
            {
                f_name,
                l_name,
                email: draft.email.trim(),
                gender: draft.gender,
            },
            draft.pendingPhotoFile,
        );

        setIsSaving(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        if (draft.pendingPhotoFile) {
            setPendingPhotoFile(null);
        }

        router.refresh();
        router.back();
    };

    const handleSaveGender = () => {
        setGender(genderSelection);
        goToForm();
    };

    const handleSavePhoto = async () => {
        if (!photoSrc) return;

        setIsSaving(true);
        setError(null);

        try {
            const blob = await cropProfileImage(photoSrc, zoom, 0, 0);
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
            const preview = URL.createObjectURL(blob);

            setPendingPhotoFile(file);
            setImagePreview(preview);
            goToForm();
        } catch {
            setError(PROFILE_STRINGS.updateError);
        } finally {
            setIsSaving(false);
        }
    };

    const openGender = () => {
        setGenderSelection(draft.gender ?? "male");
        setView("gender");
    };

    const shellConfig = {
        form: {
            title: PROFILE_STRINGS.editTitle,
            footer: (
                <PrimaryButton
                    onClick={handleSaveForm}
                    disabled={isSaving}
                    className="h-12 rounded-xl py-3 text-[16px] font-bold"
                >
                    {PROFILE_STRINGS.save}
                </PrimaryButton>
            ),
            onBack: undefined,
        },
        gender: {
            title: PROFILE_STRINGS.genderPageTitle,
            footer: (
                <PrimaryButton onClick={handleSaveGender} className="h-12 rounded-xl py-3 text-[16px] font-bold">
                    {PROFILE_STRINGS.save}
                </PrimaryButton>
            ),
            onBack: goToForm,
        },
        photo: {
            title: PROFILE_STRINGS.photoTitle,
            footer: (
                <PrimaryButton
                    onClick={handleSavePhoto}
                    disabled={isSaving}
                    className="h-12 rounded-xl py-3 text-[16px] font-bold"
                >
                    {PROFILE_STRINGS.save}
                </PrimaryButton>
            ),
            onBack: goToForm,
        },
    }[view];

    return (
        <ProfileSubpageShell
            title={shellConfig.title}
            footer={shellConfig.footer}
            onBack={shellConfig.onBack}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            footerClassName={footerAboveNavClass}
            mainClassName="pb-36"
        >
            {view === "form" && (
                <div className="mx-auto flex w-full max-w-[343px] flex-col gap-4">
                    <div className="flex justify-center py-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative rounded-full transition-transform active:scale-[0.98]"
                            aria-label="تغيير صورة الملف الشخصي"
                        >
                            <ProfileAvatar
                                src={draft.imagePreview}
                                alt={draft.fullName}
                                size={100}
                                className="border border-[#F6F5F8]"
                            />
                            <span className="absolute bottom-0 end-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#30913F] text-white shadow-sm ring-2 ring-white transition-colors group-hover:bg-[#267332]">
                                <Plus className="h-3 w-3" strokeWidth={1.5} />
                            </span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoPick}
                        />
                    </div>

                    <FieldBlock label={PROFILE_STRINGS.name} required>
                        <input
                            type="text"
                            value={draft.fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`${editableInputClass} text-start`}
                            dir="rtl"
                            autoComplete="name"
                            aria-required
                        />
                    </FieldBlock>

                    <FieldBlock label={PROFILE_STRINGS.email} required>
                        <input
                            type="email"
                            value={draft.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${editableInputClass} text-start`}
                            dir="ltr"
                            autoComplete="email"
                            aria-required
                        />
                    </FieldBlock>

                    <FieldBlock label={PROFILE_STRINGS.phone} hint={PROFILE_STRINGS.phoneNotEditable}>
                        <PhoneField value={user.phone} readOnly />
                    </FieldBlock>

                    <FieldBlock label={PROFILE_STRINGS.gender}>
                        <button
                            type="button"
                            onClick={openGender}
                            className={`${editableInputClass} justify-between`}
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0 text-[#555555]" strokeWidth={1.5} />
                            <span
                                className={`text-[14px] font-medium leading-[160%] ${draft.gender ? "text-[#343434]" : "text-[#707784]"
                                    }`}
                            >
                                {getGenderLabel(draft.gender)}
                            </span>
                        </button>
                    </FieldBlock>

                    <button
                        type="button"
                        onClick={() => router.push("/profile/delete-account")}
                        className="flex h-[50px] w-full items-center justify-center rounded-xl bg-[#F6F5F8] text-[16px] font-bold leading-[160%] text-[#EB4335] transition-colors active:opacity-80"
                    >
                        {PROFILE_STRINGS.deleteAccount}
                    </button>

                    {error && <p className="text-center text-[13px] text-red-600">{error}</p>}
                </div>
            )}

            {view === "gender" && (
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-[16px] font-bold text-[#111B18]">
                            {PROFILE_STRINGS.chooseGender}
                        </h2>
                        <p className="mt-2 text-[14px] leading-relaxed text-[#555555]">
                            {PROFILE_STRINGS.genderHelper}
                        </p>
                    </div>
                    <div>
                        <ProfileRadioRow
                            label={PROFILE_STRINGS.genderMale}
                            selected={genderSelection === "male"}
                            onSelect={() => setGenderSelection("male")}
                        />
                        <ProfileRadioRow
                            label={PROFILE_STRINGS.genderFemale}
                            selected={genderSelection === "female"}
                            onSelect={() => setGenderSelection("female")}
                        />
                    </div>
                </div>
            )}

            {view === "photo" && photoSrc && (
                <ProfilePhotoCrop
                    photoSrc={photoSrc}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    error={error}
                />
            )}
        </ProfileSubpageShell>
    );
}
