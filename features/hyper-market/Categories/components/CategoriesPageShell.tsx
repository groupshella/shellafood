"use client";

interface CategoriesPageShellProps {
    moduleId: string;
    children: React.ReactNode;
}

export function CategoriesPageShell({ moduleId, children }: CategoriesPageShellProps) {
    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-[#F6F5F8] dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir="rtl"
        >
            {children}
        </div>
    );
}
