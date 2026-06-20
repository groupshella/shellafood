"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/features/home/components/Topbar";

interface HomeShellProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export function HomeShell({ isAuthenticated, children }: HomeShellProps) {
    return (
        <div className="flex flex-col min-h-screen gap-4">
            <Topbar isAuthenticated={isAuthenticated} />



            {children}
        </div>
    );
}
