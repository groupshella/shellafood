import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Topbar } from "./Topbar";
import Image from "next/image";

export function HyperMarketShell({
    children,
    isAuthenticated,
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
}) {
    return (
        <div className="mx-auto min-h-screen w-full max-w-lg sm:max-w-2xl lg:max-w-4xl" dir="rtl">
            <Topbar isAuthenticated={isAuthenticated} />

            {children}
        </div>
    );
}
