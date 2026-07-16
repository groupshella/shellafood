"use client";

interface BrandsPageShellProps {
    children: React.ReactNode;
    isArabic: boolean;
}

export function BrandsPageShell({ children, isArabic }: BrandsPageShellProps) {
    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            {children}
        </div>
    );
}
