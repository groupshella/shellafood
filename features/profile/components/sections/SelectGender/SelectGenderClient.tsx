"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserGender } from "@/features/auth/types/auth.types";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";
import { useLanguage } from "@/features/language/useLanguage";

export function SelectGenderClient() {
    const router = useRouter();
    const { draft, setGender } = useProfileEdit();
    const { isArabic } = useLanguage();
    const [selected, setSelected] = useState<UserGender>(draft.gender ?? "male");

    const handleSave = () => {
        setGender(selected);
        router.push("/profile");
    };

    return (
        <ProfileSubpageShell
            title={isArabic ? "تحديد الجنس" : "Select gender"}
            footer={<PrimaryButton onClick={handleSave}>{isArabic ? "حفظ" : "Save"}</PrimaryButton>}
        >
            <div className="mx-auto flex w-full max-w-lg flex-col gap-6 sm:max-w-2xl lg:max-w-3xl">
                <div>
                    <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 sm:text-[17px]">
                        {isArabic ? "اختر جنسك" : "Choose your gender"}
                    </h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-gray-500 dark:text-gray-400 sm:text-[15px]">
                        {isArabic
                            ? "نستخدم هذه المعلومة لتحسين تجربتك داخل التطبيق."
                            : "We use this to improve your experience in the app."}
                    </p>
                </div>

                <div className="rounded-2xl bg-white px-3 dark:bg-gray-900 sm:px-4">
                    <ProfileRadioRow
                        label={isArabic ? "ذكر" : "Male"}
                        selected={selected === "male"}
                        onSelect={() => setSelected("male")}
                    />
                    <ProfileRadioRow
                        label={isArabic ? "أنثى" : "Female"}
                        selected={selected === "female"}
                        onSelect={() => setSelected("female")}
                    />
                </div>
            </div>
        </ProfileSubpageShell>
    );
}
