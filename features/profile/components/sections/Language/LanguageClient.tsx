"use client";

import type { AppLocale } from "@/features/profile/constants/profile.strings";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";

const LANGUAGE_OPTIONS: { code: AppLocale; label: string }[] = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English (US)" },
];

export function LanguageClient() {
    return (
        <ProfileSubpageShell title={PROFILE_STRINGS.language}>
            <div className="mx-auto w-full max-w-lg rounded-2xl bg-white px-3 dark:bg-gray-900 sm:max-w-2xl sm:px-4 lg:max-w-3xl">
                {LANGUAGE_OPTIONS.map((opt) => (
                    <ProfileRadioRow
                        key={opt.code}
                        label={opt.label}
                        selected={false}
                        href="/profile"
                    />
                ))}
            </div>
        </ProfileSubpageShell>
    );
}
