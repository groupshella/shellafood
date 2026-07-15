"use client";

interface StoreShellProps {
    children: React.ReactNode;
}

export function StoreShell({ children }: StoreShellProps) {
    return (
        <div
            className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-white pb-[calc(58px+env(safe-area-inset-bottom))] dark:bg-gray-950 md:pb-[calc(72px+env(safe-area-inset-bottom))]"
            dir="rtl"
        >
            {children}
        </div>
    );
}
