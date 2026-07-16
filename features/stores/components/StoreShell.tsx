"use client";

interface StoreShellProps {
    isArabic: boolean;
    children: React.ReactNode;
}

export function StoreShell({ isArabic, children }: StoreShellProps) {
    return (
        <div
            className="mx-auto flex min-h-dvh w-full min-w-0 max-w-lg flex-col overflow-x-hidden bg-background pb-[calc(58px+env(safe-area-inset-bottom))] sm:max-w-2xl md:max-w-3xl md:pb-[calc(72px+env(safe-area-inset-bottom))] lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            {children}
        </div>
    );
}
