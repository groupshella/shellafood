interface MyOrdersShellProps {
    children: React.ReactNode;
}

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-gray-100 dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

export function MyOrdersShell({ children }: MyOrdersShellProps) {
    return (
        <div className={SHELL_LAYOUT} dir="rtl">
            {children}
        </div>
    );
}
