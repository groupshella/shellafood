"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/features/layout/components/Navbar";
import { useCart } from "@/features/cart/context/CartContext";

function shouldShowNavbar(pathname: string): boolean {
	if (pathname === "/home" || pathname === "/") return true;
	if (pathname === "/favorites" || pathname.startsWith("/favorites/")) return true;
	if (pathname === "/cart" || pathname.startsWith("/cart/")) return true;
	if (pathname === "/my-orders") return true;
	if (pathname === "/notifications" || pathname.startsWith("/notifications/")) return true;
	if (pathname === "/profile") return true;
	if (pathname === "/coupons" || pathname.startsWith("/coupons/")) return true;
	if (pathname === "/hyper-market") return true;
	if (
		pathname === "/profile/join-driver" ||
		pathname === "/profile/join-voucher-rep"
	) {
		return true;
	}
	return false;
}

/** Persistent bottom nav for (main) routes — stays mounted across navigations. */
export function MainNavbar({ isArabic }: { isArabic: boolean }) {
	const pathname = usePathname();
	const { totalCount } = useCart();

	if (!shouldShowNavbar(pathname)) return null;

	// Cart with items uses a fixed checkout footer; keep navbar only when empty.
	if (
		(pathname === "/cart" || pathname.startsWith("/cart/")) &&
		totalCount > 0
	) {
		return null;
	}

	return <Navbar isArabic={isArabic} />;
}
