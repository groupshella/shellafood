"use client";

import { useRouter } from "next/navigation";
import type { AppLocale } from "@/features/profile/constants/profile.strings";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";

const LANGUAGE_OPTIONS: { code: AppLocale; label: string }[] = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English (US)" },
];

export function LanguageClient() {
    const router = useRouter();

    const handleSelect = (code: AppLocale) => {
        // setLocale(code);
        router.back();
    };

    return (
        <ProfileSubpageShell title={PROFILE_STRINGS.language}>
            <div>
                {LANGUAGE_OPTIONS.map((opt) => (
                    <ProfileRadioRow
                        key={opt.code}
                        label={opt.label}
                        selected={false}
                        onSelect={() => handleSelect(opt.code)}
                    />
                ))}
            </div>
        </ProfileSubpageShell>
    );
}
