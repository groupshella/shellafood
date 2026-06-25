"use client";

interface ItemShellProps {
    children: React.ReactNode;
}

export function ItemShell({ children }: ItemShellProps) {
    return (
        <div className="min-h-screen bg-white" dir="rtl">
            {children}
        </div>
    );
}
