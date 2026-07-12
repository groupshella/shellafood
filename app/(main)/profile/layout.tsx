import type { Metadata } from "next";
import { ProfileGate } from "@/features/profile/components/ProfileGate";
import { isProfileAuthenticated } from "@/features/profile/lib/get-profile-user";

export const metadata: Metadata = {
    title: "حسابي | شيلة فود",
    description: "إدارة حسابك وإعداداتك في شيلة فود",
};

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuthenticated = await isProfileAuthenticated();

    return (
        <>
            <ProfileGate isAuthenticated={isAuthenticated}>{children}</ProfileGate>
        </>
    );
}
