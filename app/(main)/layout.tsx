import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import Navbar from "@/features/layout/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    const guest = cookieStore.get(COOKIE_KEYS.GUEST_ID)?.value;
    if (!token && !guest) {
        redirect("/auth");
    }
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pb-[68px]">
                {children}
            </main>
        </div>
    );
}