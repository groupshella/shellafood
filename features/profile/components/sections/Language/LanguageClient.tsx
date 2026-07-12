"use client";

import { useLanguage, type AppLocale } from "@/features/language/useLanguage";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";

const LANGUAGE_OPTIONS: { code: AppLocale; label: string }[] = [
    { code: "ar", label: "العربية (المملكة العربية السعودية)" },
    { code: "en", label: "English (US)" },
];

export function LanguageClient() {
    const { locale, isArabic, setLanguage } = useLanguage();

    return (
        <ProfileSubpageShell title={isArabic ? "اللغة" : "Language"}>
            <div className="mx-auto w-full max-w-lg rounded-2xl bg-white px-3 dark:bg-gray-900 sm:max-w-2xl sm:px-4 lg:max-w-3xl">
                {LANGUAGE_OPTIONS.map((opt) => (
                    <ProfileRadioRow
                        key={opt.code}
                        label={opt.label}
                        selected={locale === opt.code}
                        onSelect={() => setLanguage(opt.code)}
                    />
                ))}
            </div>
        </ProfileSubpageShell>
    );
}
