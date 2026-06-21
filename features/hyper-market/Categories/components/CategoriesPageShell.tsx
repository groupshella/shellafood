"use client";

interface CategoriesPageShellProps {
    moduleId: string;
    children: React.ReactNode;
}

export function CategoriesPageShell({ moduleId, children }: CategoriesPageShellProps) {

    return (
        <div className="mx-auto min-h-screen w-full max-w-lg bg-[#F6F5F8] sm:max-w-2xl lg:max-w-4xl" dir="rtl">

            {children}
        </div>
    );
}
