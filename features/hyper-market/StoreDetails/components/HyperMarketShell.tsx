import { Topbar } from "./Topbar";

export function HyperMarketShell({
    children,
    isArabic,
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
    isArabic: boolean;
}) {
    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background pb-[calc(68px+env(safe-area-inset-bottom))] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <Topbar isArabic={isArabic} />

            {children}
        </div>
    );
}
