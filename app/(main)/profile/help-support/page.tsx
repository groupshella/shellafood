import type { Metadata } from "next";
import { HelpSupportClient } from "@/features/profile/components/sections/HelpSupport/HelpSupportClient";

export const metadata: Metadata = {
    title: "المساعدة والدعم | شيلة فود",
    description: "تواصل مع الدعم الفني واحصل على المساعدة",
};

export default function HelpSupportPage() {
    return <HelpSupportClient />;
}
