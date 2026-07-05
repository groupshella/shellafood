"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoginRequiredSheet } from "@/features/profile/components/modals/LoginRequiredSheet";

interface ProfileGateProps {
    isAuthenticated: boolean;
    children: ReactNode;
}

export function ProfileGate({ isAuthenticated, children }: ProfileGateProps) {
    const router = useRouter();

    if (isAuthenticated) return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <LoginRequiredSheet
                isOpen
                isVisible
                onClose={() => router.replace("/home")}
                onLogin={() => router.push("/auth")}
            />
        </div>
    );
}
