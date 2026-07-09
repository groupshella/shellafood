"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export type SvgProps = {
	active: boolean;
	className?: string;
};

// ── 1. HOME ICON ─────────────────────────────────────────────────────────────
export function IconHome({ active, className }: SvgProps) {
	if (active) {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
				<path
					d="M20.04 6.82L14.28 2.79C12.71 1.69 10.3 1.75 8.78999 2.92L3.77999 6.83C2.77999 7.61 1.98999 9.21 1.98999 10.47V17.37C1.98999 19.92 4.05999 22 6.60999 22H17.39C19.94 22 22.01 19.93 22.01 17.38V10.6C22.01 9.25 21.14 7.59 20.04 6.82ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={className}
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M9.02 2.84001L3.63 7.04001C2.73 7.74001 2 9.23001 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29001 21.19 7.74001 20.2 7.05001L14.02 2.72001C12.62 1.74001 10.37 1.79001 9.02 2.84001Z" />
			<path d="M12 17.99V14.99" />
		</svg>
	);
}

// ── 2. FAVORITES (HEART) ICON ────────────────────────────────────────────────
export function IconHeart({ active, className }: SvgProps) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={className}
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69001C2 5.60001 4.49 3.10001 7.56 3.10001C9.38 3.10001 10.99 3.98001 12 5.34001C13.01 3.98001 14.63 3.10001 16.44 3.10001C19.51 3.10001 22 5.60001 22 8.69001C22 15.69 15.52 19.82 12.62 20.81Z"
				fill={active ? "currentColor" : "none"}
			/>
		</svg>
	);
}

// ── 3. BAG ICON (CART) ───────────────────────────────────────────────────────
export function IconBag({ active, className }: SvgProps) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={className}
			stroke="currentColor"
			strokeWidth="1.5"
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M7.5 7.66999V6.69999C7.5 4.44999 9.31 2.23999 11.56 2.02999C14.24 1.76999 16.5 3.87999 16.5 6.50999V7.88999" />
			<path
				d="M9.00007 22H15.0001C19.0201 22 19.7401 20.39 19.9501 18.43L20.7001 12.43C20.9701 9.99 20.2701 8 16.0001 8H8.00007C3.73007 8 3.03007 9.99 3.30007 12.43L4.05007 18.43C4.26007 20.39 4.98007 22 9.00007 22Z"
				fill={active ? "currentColor" : "none"}
			/>
			<path d="M15.4955 12H15.5045" stroke={active ? "#fff" : "currentColor"} />
			<path d="M8.49451 12H8.50349" stroke={active ? "#fff" : "currentColor"} />
		</svg>
	);
}

// ── 4. RECEIPT ICON ──────────────────────────────────────────────────────────
export function IconReceipt({ active, className }: SvgProps) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={className}
			stroke="currentColor"
			strokeWidth="1.5"
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z"
				fill={active ? "currentColor" : "none"}
			/>
			<path
				d="M2 7V21C2 21.83 2.93998 22.3 3.59998 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.28998 22.29C8.67998 22.68 9.32002 22.68 9.71002 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z"
				fill={active ? "currentColor" : "none"}
			/>
			<path d="M6 9H12" stroke={active ? "#fff" : "currentColor"} />
			<path d="M6.75 13H11.25" stroke={active ? "#fff" : "currentColor"} />
		</svg>
	);
}

// ── 5. USER PROFILE ICON ─────────────────────────────────────────────────────
export function IconUser({ active, className }: SvgProps) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={className}
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
				fill={active ? "currentColor" : "none"}
			/>
			<path
				d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
				fill={active ? "currentColor" : "none"}
			/>
		</svg>
	);
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
	{ id: "home", label: "الرئيسية", Icon: IconHome, path: "/home" },
	{ id: "favorites", label: "المفضلة", Icon: IconHeart, path: "/favorites" },
	{ id: "cart", label: "السلة", Icon: IconBag, path: "/cart" },
	{ id: "my-orders", label: "طلباتي", Icon: IconReceipt, path: "/my-orders" },
	{ id: "profile", label: "حسابي", Icon: IconUser, path: "/profile" },
] as const;

function isActive(pathname: string, path: string) {
	if (path === "/home") return pathname === "/home" || pathname === "/";
	return pathname === path || pathname.startsWith(`${path}/`);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav
			dir="rtl"
			className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/90 pb-safe backdrop-blur-lg dark:border-gray-700/80 dark:bg-gray-900/95"
			aria-label="التنقل الرئيسي"
		>
			<div className="mx-auto flex h-[64px] w-full max-w-lg items-end justify-around px-1 pb-2 sm:h-[68px] sm:max-w-xl sm:px-2 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
				{NAV_ITEMS.map((item) => {
					const active = isActive(pathname, item.path);
					const { Icon } = item;

					return (
						<Link
							key={item.id}
							href={item.path}
							aria-label={item.label}
							aria-current={active ? "page" : undefined}
							className={[
								"flex min-h-11 min-w-[44px] flex-1 flex-col items-center justify-end gap-1 rounded-lg pb-1 sm:min-w-[52px]",
								"transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
								"dark:focus-visible:ring-offset-gray-900",
								active
									? "text-[#30913F]"
									: "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300",
							].join(" ")}
						>
							<Icon active={active} className="h-[22px] w-[22px] sm:h-6 sm:w-6" />
							{active && (
								<span className="text-[9px] font-bold leading-none tracking-wide sm:text-[10px]">
									{item.label}
								</span>
							)}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
