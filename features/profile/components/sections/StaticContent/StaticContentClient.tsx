"use client";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { StaticContentBody } from "@/features/profile/components/shared/StaticContentBody";
import { useLanguage } from "@/features/language/useLanguage";

interface StaticContentClientProps {
    title: {
        ar: string;
        en: string;
    };
    content: string;
}

export function StaticContentClient({ title, content }: StaticContentClientProps) {
    const { isArabic } = useLanguage();

    return (
        <ProfileSubpageShell
            title={isArabic ? title.ar : title.en}
            showHeaderBorder
            mainClassName="pb-8 pt-2 sm:px-6"
        >
            <StaticContentBody content={content} />
        </ProfileSubpageShell>
    );
}
