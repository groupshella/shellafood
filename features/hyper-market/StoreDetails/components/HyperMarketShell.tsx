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
        <div className="mx-auto min-h-screen w-full max-w-lg sm:max-w-2xl lg:max-w-4xl" dir="rtl">
            <Topbar isAuthenticated={isAuthenticated} />

            {children}
            <Navbar />
        </div>
    );
}
