import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getCart } from "@/features/cart/api/cart";
import { CartProvider } from "@/features/cart/context/CartContext";
import { getServerLocale } from "@/features/language/getServerLocale";
import { MainNavbar } from "@/features/layout/components/MainNavbar";
import { NotificationProvider } from "@/shared/components/NotificationToast";
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
	const locale = await getServerLocale();
	const isArabic = locale === "ar";

	if (!token && !guest) {
		redirect("/auth");
	}

	const cartItems = await getCart({ isArabic });

	return (
		<NotificationProvider>
			<CartProvider initialItems={cartItems}>
				<main className="min-h-screen">{children}</main>
				<MainNavbar isArabic={isArabic} />
			</CartProvider>
		</NotificationProvider>
	);
}
