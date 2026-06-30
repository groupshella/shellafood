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
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={className}
			fill={active ? "currentColor" : "none"}
			stroke={active ? "none" : "currentColor"}
			strokeWidth={active ? undefined : "1.75"}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{active ? (
				/* Solid filled house — Optimized single path */
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			) : (
				/* Outline house — Structural paths */
				<>
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</>
			)}
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
			aria-hidden="true"
			className={className}
			fill={active ? "currentColor" : "none"}
			stroke={active ? "none" : "currentColor"}
			strokeWidth={active ? undefined : "1.75"}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
			aria-hidden="true"
			className={className}
			fill={active ? "currentColor" : "none"}
			stroke={active ? "none" : "currentColor"}
			strokeWidth={active ? undefined : "1.75"}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
			<line
				x1="3"
				y1="6"
				x2="21"
				y2="6"
				stroke={active ? "white" : "currentColor"}
				strokeWidth={active ? "1.5" : undefined}
			/>
			<path
				d="M16 10a4 4 0 0 1-8 0"
				stroke={active ? "white" : "currentColor"}
				strokeWidth={active ? "1.5" : undefined}
			/>
		</svg>
	);
}

// ── 3. RECEIPT ICON ──────────────────────────────────────────────────────────
export function IconReceipt({ active, className }: SvgProps) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={className}
			fill={active ? "currentColor" : "none"}
			stroke={active ? "none" : "currentColor"}
			strokeWidth={active ? undefined : "1.75"}
			strokeLinecap="round"
		>
			{/* Outer zigzag ticket border remains constant across states */}
			<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />

			{/* Inner horizontal details change stroke configuration dynamically */}
			<path
				d="M16 8H8M16 12H8M12 16H8"
				stroke={active ? "white" : "currentColor"}
				strokeWidth={active ? "1.4" : undefined}
			/>
		</svg>
	);
}

// ── 4. BADGE (PROMO) ICON ────────────────────────────────────────────────────
export function IconBadge({ active, className }: SvgProps) {
	const sealPath =
		"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z";

	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={className}
			fill={active ? "currentColor" : "none"}
			stroke={active ? "none" : "currentColor"}
			strokeWidth={active ? undefined : "1.75"}
			strokeLinecap="round"
		>
			<path d={sealPath} />
			<line
				x1="9.5"
				y1="14.5"
				x2="14.5"
				y2="9.5"
				stroke={active ? "white" : "currentColor"}
				strokeWidth={active ? "1.4" : undefined}
			/>
			<circle
				cx="9.5"
				cy="9.5"
				r={active ? "1.1" : "1"}
				fill={active ? "white" : "currentColor"}
				stroke="none"
			/>
			<circle
				cx="14.5"
				cy="14.5"
				r={active ? "1.1" : "1"}
				fill={active ? "white" : "currentColor"}
				stroke="none"
			/>
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
			aria-hidden="true"
			className={className}
			fill={active ? "currentColor" : "none"}
			stroke={active ? "none" : "currentColor"}
			strokeWidth={active ? undefined : "1.75"}
			strokeLinecap="round"
		>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
		</svg>
	);
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
	{ id: "home", label: "الرئيسية", Icon: IconHome, path: "/home" },
	{ id: "favorites", label: "المفضلة", Icon: IconHeart, path: "/favorites" },
	{ id: "cart", label: "السلة", Icon: IconBag, path: "/cart" },
	{ id: "my-orders", label: "طلباتي", Icon: IconReceipt, path: "/my-orders" },
	{ id: "discounts", label: "الخصومات", Icon: IconBadge, path: "/discounts" },
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
			className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/90 pb-safe backdrop-blur-lg"
			aria-label="التنقل الرئيسي"
		>
			<div className="flex h-[68px] items-end justify-around pb-2 px-1">
				{NAV_ITEMS.map((item) => {
					const active = isActive(pathname, item.path);
					const { Icon } = item;

					return (
						<Link
							key={item.id}
							href={item.path}
							aria-label={item.label}
							aria-current={active ? "page" : undefined}
							className={`flex min-w-[52px] flex-col items-center justify-end gap-1 pb-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] ${active ? "text-[#30913F]" : "text-gray-400 hover:text-gray-500"
								}`}
						>
							<Icon active={active} />
							{active && (
								<span className="text-[10px] font-bold leading-none tracking-wide">
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
