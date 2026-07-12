import type { Metadata } from "next";
import { JoinDriverClient } from "@/features/profile/components/sections/JoinDriver/JoinDriverClient";

export const metadata: Metadata = {
    title: "انضم كرجل توصيل | شيلة فود",
    description: "قدّم طلب الانضمام كسائق توصيل مع شيلة فود",
};

export default function JoinDriverPage() {
    return <JoinDriverClient />;
}
