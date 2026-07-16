interface MyOrdersShellProps {
    children: React.ReactNode;
    isArabic: boolean;
}

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

export function MyOrdersShell({ children, isArabic }: MyOrdersShellProps) {
    return (
        <div
            className={SHELL_LAYOUT}
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            {children}
        </div>
    );
}
