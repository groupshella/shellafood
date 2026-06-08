import Navbar from "@/features/layout/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pb-[68px]">
                {children}
            </main>
        </div>
    );
}