import { MarketsStoreProvider } from "@/features/markets/context/MarketsStoreContext";
import { Topbar } from "./Topbar";

export function MarketsShell({
    children,
    moduleId,
    moduleName,
    isAuthenticated,
}: {
    children: React.ReactNode;
    moduleId: string;
    moduleName: string;
    isAuthenticated: boolean;
}) {
    return (
        <div
            className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-3 overflow-x-hidden bg-[#F6F5F8] pb-6 dark:bg-gray-950 sm:max-w-2xl sm:gap-4 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir="rtl"
        >
            <Topbar moduleName={moduleName} moduleId={moduleId} isAuthenticated={isAuthenticated} />

            <MarketsStoreProvider moduleId={moduleId}>{children}</MarketsStoreProvider>
        </div>
    );
}
