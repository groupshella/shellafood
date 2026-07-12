import type { Metadata } from "next";
import { LiveChatClient } from "@/features/profile/components/sections/LiveChat/LiveChatClient";

export const metadata: Metadata = {
    title: "الدردشة الحية | شيلة فود",
    description: "تواصل مباشرة مع فريق الدعم عبر الدردشة الحية",
};

export default function LiveChatPage() {
    return <LiveChatClient />;
}
