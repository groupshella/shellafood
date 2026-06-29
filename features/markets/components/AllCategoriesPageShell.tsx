"use client";

interface AllCategoriesPageShellProps {
    children: React.ReactNode;
}

export function AllCategoriesPageShell({ children }: AllCategoriesPageShellProps) {
    return (
        <div
            className="mx-auto min-h-screen w-full max-w-lg bg-black sm:max-w-2xl lg:max-w-4xl"
            dir="rtl"
        >
            {children}
        </div>
    );
}
