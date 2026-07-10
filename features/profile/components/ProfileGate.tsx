"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LoginRequiredSheet } from "@/features/profile/components/modals/LoginRequiredSheet";

interface ProfileGateProps {
    isAuthenticated: boolean;
    children: ReactNode;
}

export function ProfileGate({ isAuthenticated, children }: ProfileGateProps) {
    const router = useRouter();

    if (isAuthenticated) return <>{children}</>;

    return (
        <div className="min-h-dvh overflow-x-hidden bg-[#F5F5F5] dark:bg-gray-950">
            <LoginRequiredSheet
                isOpen
                isVisible
                onClose={() => router.replace("/home")}
                loginHref="/auth"
            />
        </div>
    );
}
