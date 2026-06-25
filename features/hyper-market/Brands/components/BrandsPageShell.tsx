"use client";

interface BrandsPageShellProps {
    children: React.ReactNode;
}

export function BrandsPageShell({ children }: BrandsPageShellProps) {
    return (
        <div className="mx-auto min-h-screen w-full max-w-lg bg-[#F6F5F8] sm:max-w-2xl lg:max-w-4xl" dir="rtl">
            {children}
        </div>
    );
}
