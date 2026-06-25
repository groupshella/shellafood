import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getCart } from "@/features/cart/api/cart";
import { CartProvider } from "@/features/cart/context/CartContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ModulesLayout({
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

    const cartItems = await getCart();

    return (
        <CartProvider initialItems={cartItems}>
            <main className="min-h-screen">{children}</main>
        </CartProvider>
    );
}
