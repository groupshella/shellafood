"use client";

import { Topbar } from "@/features/home/components/Topbar";
import Navbar from "@/features/layout/components/Navbar";

interface HomeShellProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export function HomeShell({ isAuthenticated, children }: HomeShellProps) {
    return (
        <div className="flex flex-col min-h-screen gap-4">
            <Topbar />
            {children}
            <Navbar />
        </div>
    );
}
