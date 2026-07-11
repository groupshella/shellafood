import { MODULE_PAGE_BG } from "@/shared/lib/page-surface";
import { Topbar } from "./Topbar";

export function HyperMarketShell({
    children,
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
}) {
    return (
        <div
            className={`mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden pb-[calc(68px+env(safe-area-inset-bottom))] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${MODULE_PAGE_BG}`}
            dir="rtl"
        >
            <Topbar />

            {children}
        </div>
    );
}
