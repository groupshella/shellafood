import { MarketsStoreProvider } from "@/features/markets/context/MarketsStoreContext";
import { MODULE_PAGE_BG } from "@/shared/lib/page-surface";
import { Topbar } from "./Topbar";

export function MarketsShell({
    children,
    moduleId,
    moduleName,
    isAuthenticated,
    isArabic,
}: {
    children: React.ReactNode;
    moduleId: string;
    moduleName: string;
    isAuthenticated: boolean;
    isArabic: boolean;
}) {
    return (
        <div
            className={`mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-3 overflow-x-hidden pb-[calc(68px+env(safe-area-inset-bottom))] sm:max-w-2xl sm:gap-4 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${MODULE_PAGE_BG}`}
            dir={isArabic ? "rtl" : "ltr"}
        >
            <Topbar moduleName={moduleName} moduleId={moduleId} isAuthenticated={isAuthenticated} isArabic={isArabic} />

            <MarketsStoreProvider moduleId={moduleId} isArabic={isArabic}>{children}</MarketsStoreProvider>
        </div>
    );
}
