"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserGender } from "@/features/auth/types/auth.types";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";

export function SelectGenderClient() {
    const router = useRouter();
    const { draft, setGender } = useProfileEdit();
    const [selected, setSelected] = useState<UserGender>(draft.gender ?? "male");

    const handleSave = () => {
        setGender(selected);
        router.back();
    };

    return (
        <ProfileSubpageShell
            title={PROFILE_STRINGS.genderPageTitle}
            footer={<PrimaryButton onClick={handleSave}>{PROFILE_STRINGS.save}</PrimaryButton>}
        >
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-[16px] font-bold text-gray-900">{PROFILE_STRINGS.chooseGender}</h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                        {PROFILE_STRINGS.genderHelper}
                    </p>
                </div>

                <div>
                    <ProfileRadioRow
                        label={PROFILE_STRINGS.genderMale}
                        selected={selected === "male"}
                        onSelect={() => setSelected("male")}
                    />
                    <ProfileRadioRow
                        label={PROFILE_STRINGS.genderFemale}
                        selected={selected === "female"}
                        onSelect={() => setSelected("female")}
                    />
                </div>
            </div>
        </ProfileSubpageShell>
    );
}
