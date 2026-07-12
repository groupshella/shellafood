import type { Metadata } from "next";
import { LanguageClient } from "@/features/profile/components/sections/Language/LanguageClient";

export const metadata: Metadata = {
    title: "اللغة | شيلة فود",
    description: "اختر لغة التطبيق",
};

export default function LanguagePage() {
    return <LanguageClient />;
}
