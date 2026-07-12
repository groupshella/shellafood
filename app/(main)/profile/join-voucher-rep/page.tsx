import type { Metadata } from "next";
import { JoinVoucherRepClient } from "@/features/profile/components/sections/JoinVoucherRep/JoinVoucherRepClient";

export const metadata: Metadata = {
    title: "مندوب قسائم شرائية | شيلة فود",
    description: "انضم كمندوب تسويق قسائم شرائية مع شيلة فود",
};

export default function JoinVoucherRepPage() {
    return <JoinVoucherRepClient />;
}
