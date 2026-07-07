import { Topbar } from "./Topbar";
import Navbar from "@/features/layout/components/Navbar";

export function HyperMarketShell({
    children,
    isAuthenticated,
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
}) {
    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-[#F6F5F8] pb-[calc(68px+env(safe-area-inset-bottom))] dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir="rtl"
        >
            <Topbar />

            {children}
            <Navbar />
        </div>
    );
}
