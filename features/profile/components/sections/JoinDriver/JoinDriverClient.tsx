"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { JoinSuccessModal } from "@/features/profile/components/modals/JoinSuccessModal";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import {
    FormField,
    footerAboveNavClass,
    formContainerClass,
    inputClassName,
    sectionTitleClass,
} from "@/features/profile/components/shared/registration/FormField";
import {
    FileUploadZone,
    TermsCheckbox,
} from "@/features/profile/components/shared/registration/FileUploadZone";
import { FormDropdown } from "@/features/profile/components/shared/registration/FormDropdown";
import { PasswordInput } from "@/features/profile/components/shared/registration/PasswordInput";
import {
    JOIN_DROPDOWN_OPTIONS,
    JOIN_STRINGS,
    MAX_UPLOAD_BYTES,
} from "@/features/profile/constants/join.strings";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";

const buttonShadow = "shadow-[0_4px_14px_rgba(48,145,63,0.22)]";

export function JoinDriverClient() {
    const router = useRouter();

    const [profilePhoto, setProfilePhoto] = useState<{ file: File; previewName: string } | null>(
        null,
    );
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [idPhoto, setIdPhoto] = useState<{ file: File; previewName: string } | null>(null);
    const [workType, setWorkType] = useState("");
    const [address, setAddress] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [idType, setIdType] = useState("");
    const [agreed, setAgreed] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProfileFileSelect = (file: File) => {
        const validation = validateUploadFile(file, MAX_UPLOAD_BYTES);
        if (validation) {
            setError(JOIN_STRINGS.fileTooLarge);
            return;
        }
        setError(null);
        setProfilePhoto({ file, previewName: JOIN_STRINGS.fileName });
    };

    const handleIdFileSelect = (file: File) => {
        const validation = validateUploadFile(file, MAX_UPLOAD_BYTES);
        if (validation) {
            setError(JOIN_STRINGS.fileTooLarge);
            return;
        }
        setError(null);
        setIdPhoto({ file, previewName: JOIN_STRINGS.fileName });
    };

    const handleSubmit = async () => {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError(JOIN_STRINGS.requiredField);
            return;
        }
        if (password !== confirmPassword) {
            setError(JOIN_STRINGS.passwordMismatch);
            return;
        }
        if (!idPhoto || !workType || !address || !deliveryMethod || !idType) {
            setError(JOIN_STRINGS.requiredField);
            return;
        }
        if (!agreed) {
            setError(JOIN_STRINGS.mustAgreeTerms);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // TODO: wire to backend API when available
        await new Promise((resolve) => setTimeout(resolve, 600));

        setIsSubmitting(false);
        setShowSuccess(true);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.replace("/profile");
    };

    return (
        <>
            <ProfileSubpageShell
                title={JOIN_STRINGS.driverTitle}
                subtitle={JOIN_STRINGS.driverSubtitle}
                subtitleAlign="start"
                relaxedHeader
                showHeaderBorder={false}
                showFooterBorder={false}
                footerClassName={footerAboveNavClass}
                mainClassName="pb-36"
                footer={
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`h-12 rounded-xl py-3 text-[16px] font-bold ${buttonShadow}`}
                    >
                        {JOIN_STRINGS.send}
                    </PrimaryButton>
                }
            >
                <div className={`${formContainerClass} gap-5 pb-2`}>
                    <section>
                        <h2 className={sectionTitleClass}>{JOIN_STRINGS.yourProfile}</h2>
                        <FileUploadZone
                            title={JOIN_STRINGS.addProfilePhoto}
                            uploaded={profilePhoto}
                            onSelect={handleProfileFileSelect}
                            onRemove={() => setProfilePhoto(null)}
                        />
                    </section>

                    <FormField label={JOIN_STRINGS.firstName} required>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder={JOIN_STRINGS.firstName}
                            className={`${inputClassName} text-start`}
                            dir="rtl"
                            autoComplete="given-name"
                            aria-required
                        />
                    </FormField>

                    <FormField label={JOIN_STRINGS.lastName} required>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder={JOIN_STRINGS.lastName}
                            className={`${inputClassName} text-start`}
                            dir="rtl"
                            autoComplete="family-name"
                            aria-required
                        />
                    </FormField>

                    <FormField label={JOIN_STRINGS.email} required>
                        <input
                            type="email"
                            inputMode="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={JOIN_STRINGS.email}
                            className={`${inputClassName} text-start`}
                            dir="ltr"
                            autoComplete="email"
                            aria-required
                        />
                    </FormField>

                    <FormField label={JOIN_STRINGS.password} required>
                        <PasswordInput
                            value={password}
                            onChange={setPassword}
                            placeholder={JOIN_STRINGS.password}
                        />
                    </FormField>

                    <FormField label={JOIN_STRINGS.confirmPassword} required>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder={JOIN_STRINGS.confirmPassword}
                        />
                    </FormField>

                    <section id="driver-details" className="scroll-mt-4">
                        <h2 className={sectionTitleClass}>{JOIN_STRINGS.personalId}</h2>
                        <FileUploadZone
                            title={JOIN_STRINGS.addIdPhoto}
                            uploaded={idPhoto}
                            onSelect={handleIdFileSelect}
                            onRemove={() => setIdPhoto(null)}
                        />
                    </section>

                    <FormDropdown
                        label={JOIN_STRINGS.chooseWorkType}
                        value={workType}
                        options={JOIN_DROPDOWN_OPTIONS}
                        onChange={setWorkType}
                        placeholder={JOIN_STRINGS.chooseWorkType}
                        required
                    />

                    <FormDropdown
                        label={JOIN_STRINGS.chooseAddress}
                        value={address}
                        options={JOIN_DROPDOWN_OPTIONS}
                        onChange={setAddress}
                        placeholder={JOIN_STRINGS.chooseAddress}
                        required
                    />

                    <FormDropdown
                        label={JOIN_STRINGS.chooseDeliveryMethod}
                        value={deliveryMethod}
                        options={JOIN_DROPDOWN_OPTIONS}
                        onChange={setDeliveryMethod}
                        placeholder={JOIN_STRINGS.chooseDeliveryMethod}
                        required
                    />

                    <FormDropdown
                        label={JOIN_STRINGS.chooseIdType}
                        value={idType}
                        options={JOIN_DROPDOWN_OPTIONS}
                        onChange={setIdType}
                        placeholder={JOIN_STRINGS.chooseIdType}
                        required
                    />

                    <TermsCheckbox checked={agreed} onChange={setAgreed} />

                    {error && (
                        <p className="text-center text-[13px] text-red-600">{error}</p>
                    )}
                </div>
            </ProfileSubpageShell>

            <JoinSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        </>
    );
}
