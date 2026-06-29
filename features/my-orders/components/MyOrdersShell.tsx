import Navbar from "@/features/layout/components/Navbar";

interface MyOrdersShellProps {
    children: React.ReactNode;
}

export function MyOrdersShell({ children }: MyOrdersShellProps) {
    return (
        <div className="mx-auto min-h-screen w-full max-w-lg sm:max-w-2xl lg:max-w-4xl bg-[#F5F5F5]" dir="rtl">
            {children}
            <Navbar />
        </div>
    );
}
