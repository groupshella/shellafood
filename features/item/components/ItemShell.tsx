"use client";

interface ItemShellProps {
    children: React.ReactNode;
}

export function ItemShell({ children }: ItemShellProps) {
    return (
        <div className="min-h-screen bg-[#F5F5F5]" dir="rtl">

            {children}
        </div>
    );
}
