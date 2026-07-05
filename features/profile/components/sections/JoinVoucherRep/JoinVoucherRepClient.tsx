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
import { FileUploadZone } from "@/features/profile/components/shared/registration/FileUploadZone";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import { JOIN_STRINGS, MAX_UPLOAD_BYTES } from "@/features/profile/constants/join.strings";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";

const buttonShadow = "shadow-[0_4px_14px_rgba(48,145,63,0.22)]";

export function JoinVoucherRepClient() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [document, setDocument] = useState<{ file: File; previewName: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileSelect = (file: File) => {
        const validation = validateUploadFile(file, MAX_UPLOAD_BYTES);
        if (validation) {
            setError(JOIN_STRINGS.fileTooLarge);
            return;
        }
        setError(null);
        setDocument({ file, previewName: JOIN_STRINGS.fileName });
    };

    const handleSubmit = async () => {
        if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
            setError(JOIN_STRINGS.requiredField);
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
                title={JOIN_STRINGS.voucherTitle}
                subtitle={JOIN_STRINGS.voucherSubtitle}
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
                <div className={`${formContainerClass} pb-2`}>
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

                    <FormField label={JOIN_STRINGS.phone} required>
                        <PhoneField
                            value={phone}
                            onChange={setPhone}
                            placeholder="5x xxx xxxx"
                        />
                    </FormField>

                    <section>
                        <h2 className={sectionTitleClass}>{JOIN_STRINGS.documents}</h2>
                        <p className="mb-3 text-[13px] font-medium leading-relaxed text-[#555555]">
                            {JOIN_STRINGS.documentsDesc}
                        </p>
                        <FileUploadZone
                            title={JOIN_STRINGS.chooseFile}
                            uploaded={document}
                            onSelect={handleFileSelect}
                            onRemove={() => setDocument(null)}
                            accept="image/*,.pdf"
                            variant="document"
                        />
                    </section>

                    {error && (
                        <p className="text-center text-[13px] text-red-600">{error}</p>
                    )}
                </div>
            </ProfileSubpageShell>

            <JoinSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        </>
    );
}
